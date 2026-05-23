import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';

// Load env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const OLD_BASE_URL = 'http://localhost:5000';
const NEW_BASE_URL = process.env.BACKEND_URL || 'https://galatadesalegn-gi24.onrender.com';

async function migrateUrls() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    let totalUpdated = 0;

    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`\nProcessing collection: ${collectionName}`);

      const documents = await db.collection(collectionName).find({}).toArray();

      for (const doc of documents) {
        let updates = {};
        let needsUpdate = false;

        // Check all string fields for localhost URLs
        for (const [key, value] of Object.entries(doc)) {
          if (typeof value === 'string' && value.includes(OLD_BASE_URL)) {
            updates[key] = value.replace(new RegExp(OLD_BASE_URL, 'g'), NEW_BASE_URL);
            needsUpdate = true;
            console.log(`  Found localhost URL in ${collectionName}.${doc._id}.${key}`);
          }
        }

        // Check nested objects
        if (doc.pillars && Array.isArray(doc.pillars)) {
          doc.pillars.forEach((pillar, idx) => {
            if (pillar.icon && pillar.icon.includes(OLD_BASE_URL)) {
              if (!updates.pillars) updates.pillars = doc.pillars;
              updates.pillars[idx].icon = pillar.icon.replace(new RegExp(OLD_BASE_URL, 'g'), NEW_BASE_URL);
              needsUpdate = true;
              console.log(`  Found localhost URL in ${collectionName}.${doc._id}.pillars[${idx}].icon`);
            }
          });
        }

        if (needsUpdate) {
          await db.collection(collectionName).updateOne(
            { _id: doc._id },
            { $set: updates }
          );
          totalUpdated++;
          console.log(`  Updated document ${doc._id}`);
        }
      }
    }

    console.log(`\n✅ Migration complete! Updated ${totalUpdated} documents.`);
    console.log(`Replaced ${OLD_BASE_URL} with ${NEW_BASE_URL}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  }
}

migrateUrls();
