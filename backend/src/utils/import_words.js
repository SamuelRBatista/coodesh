import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Word from '../models/Word.js'; 

dotenv.config({ path: '../../config.env' });


const argv = yargs(process.argv.slice(2))
  .option('file', { type: 'string', demandOption: true })
  .option('batch', { type: 'number', default: 1000 })
  .parse();

const file = path.resolve(process.cwd(), argv.file);

if (!fs.existsSync(file)) {
  console.error('File not found', file);
  process.exit(1);
}

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}

async function main() {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const data = fs.readFileSync(file, 'utf8');
  const words = data.split(/\r?\n/).map(w => w.trim()).filter(Boolean);

  const batchSize = argv.batch;
  for (let i = 0; i < words.length; i += batchSize) {
    const chunk = words.slice(i, i + batchSize).map(w => ({ word: w }));
    try {
      await Word.insertMany(chunk, { ordered: false });
      console.log(`Inserted ${Math.min(i + batchSize, words.length)} / ${words.length}`);
    } catch (err) {
      console.warn('Batch insert warning', err.message);
    }
  }

  console.log('Import finished');
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
