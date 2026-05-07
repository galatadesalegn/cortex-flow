import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load env FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Environment variable validation
const requiredEnvVars = ['MONGO_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file');
  process.exit(1);
}

// Validate JWT_SECRET length
if (process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET must be at least 32 characters long');
  process.exit(1);
}

if (process.env.NODE_ENV !== 'production') {
  console.log('✅ Environment variables validated');
  console.log('✅ MONGO_URL loaded');
}

// MongoDB import (AFTER env load)
import connectDB, { testConnection, disconnectDB } from './config/db.js';

// Routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import certificateRoutes from './routes/certificates.js';
import skillRoutes from './routes/skills.js';
import experienceRoutes from './routes/experiences.js';
import educationRoutes from './routes/education.js';
import serviceRoutes from './routes/services.js';
import messageRoutes from './routes/messages.js';
import uploadRoutes from './routes/upload.js';
import profileRoutes from './routes/profile.js';
import userRoutes from './routes/users.js';
import testimonialRoutes from './routes/testimonials.js';

// Middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS - MUST BE FIRST
const allowedOrigins = [
  'http://localhost:5173',  // Frontend dev
  'http://localhost:5174',  // Admin dev
  'http://localhost:8888',  // Backend dev
  'http://localhost:5000',  // Old backend dev
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// 2. Security & Parsers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "blob:", "https://res.cloudinary.com", "*"],
    },
  },
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(mongoSanitize());

// 3. Rate Limiting (AFTER CORS)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later' },
  skip: (req) => req.method === 'OPTIONS' || process.env.NODE_ENV !== 'production', // Skip in development
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many login attempts, please try again later' },
  skip: (req) => req.method === 'OPTIONS' || process.env.NODE_ENV !== 'production',
});
app.use('/api/auth/login', authLimiter);

// Static uploads
app.use('/uploads', express.static(join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    // If file has no extension, default to image/jpeg for existing uploads
    if (!path.split('/').pop().includes('.')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
  }
}));

// Basic health (no DB)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server running',
    time: new Date().toISOString(),
  });
});

// Test route
app.post('/api/test-login', (req, res) => {
  const { email } = req.body;
  res.json({ success: true, email });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/testimonials', testimonialRoutes);

// DB health endpoint
app.get('/api/health', async (req, res) => {
  try {
    const ok = await testConnection();

    res.json({
      status: ok ? 'healthy' : 'unhealthy',
      database: ok ? 'connected' : 'disconnected',
      time: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      error: err.message,
    });
  }
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// ✅ SAFE SERVER START (MongoDB)
const startServer = async () => {
  // Connect to MongoDB FIRST
  const dbConnected = await connectDB();
  
  if (!dbConnected) {
    console.error('❌ MongoDB connection failed. Server not started.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    }
  });
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  await disconnectDB();
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});