import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize dotenv with absolute path to .env file in the backend root
const result = dotenv.config({ path: join(__dirname, '../.env') });

if (result.error) {
    console.error('❌ Failed to load .env file:', result.error.message);
} else {
    console.log('✅ Environment variables loaded from:', join(__dirname, '../.env'));
    console.log('   RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Present (starts with ' + process.env.RESEND_API_KEY.substring(0, 5) + '...)' : 'MISSING');
}

export default process.env;
