const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  word: { type: String, required: true, index: true },
  added: { type: Date, default: Date.now }
});

HistorySchema.index({ userId: 1, word: 1 }, { unique: true });

module.exports = mongoose.model('History', HistorySchema);
