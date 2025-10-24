const mongoose = require('mongoose');
const { Schema } = mongoose;

const dictionarySchema = new Schema({
  wordUrdu: {           // Original Urdu word
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  wordHindi: {          // Devanagari version
    type: String,
    trim: true
  },
  wordEnglish: {        // Roman/English spelling
    type: String,
    trim: true
  },
  meaning: {            // Meanings in multiple languages
    hindi: { type: String, required: true },
    english: { type: String, required: true }
  },
  usage: {
    type: String
  }
}, {
  timestamps: true
});

// Index for fast search by word in any script
dictionarySchema.index({ wordUrdu: 'text', wordHindi: 'text', wordEnglish: 'text' });

const Dictionary = mongoose.model('dictionary', dictionarySchema);
module.exports = Dictionary;
