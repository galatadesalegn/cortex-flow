import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize dotenv with absolute path to .env file in the backend root
const result = dotenv.config({ path: join(__dirname, '../.env') });

if (result.error) {
    // Only log error if file exists but has issues, or if we're in development
    if (result.error.code !== 'ENOENT') {
        console.error('❌ Failed to load .env file:', result.error.message);
    } else if (process.env.NODE_ENV !== 'production') {
        console.warn('ℹ️ No .env file found at:', join(__dirname, '../.env'));
    }
} else {
    console.log('✅ Environment variables loaded from .env file');
}

if (process.env.NODE_ENV !== 'production') {
    console.log('   RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Present' : 'MISSING');
}

export default process.env;
