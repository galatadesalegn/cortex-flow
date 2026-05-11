import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return false;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB Disconnected');
  } catch (error) {
    console.error(`❌ MongoDB Disconnect Error: ${error.message}`);
  }
};

// Health check function
export const testConnection = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Database health check: Connected');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Database health check failed:', error.message);
    return false;
  }
};

export default connectDB;
