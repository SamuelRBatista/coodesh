import mongoose from 'mongoose';

const WordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
    index: { unique: true, collation: { locale: 'en', strength: 2 } } // Índice único case-insensitive
  },
  data: { type: Array, default: [] }
});

export default mongoose.model('Word', WordSchema);