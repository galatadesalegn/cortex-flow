import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from '../config/db.js';
import { User } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    const connected = await connectDB();
    if (!connected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'galataddesalegn@gmail.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists. Updating password to admin123...');
      existingAdmin.password = 'admin123';
      await existingAdmin.save();
      console.log('✅ Admin password updated successfully!');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Galata Desalegn',
      email: 'galataddesalegn@gmail.com',
      password: 'admin123', // Change this to your preferred password
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('   Email:', adminUser.email);
    console.log('   Password: admin123');
    console.log('\n📝 You can now log in with these credentials');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdminUser();
