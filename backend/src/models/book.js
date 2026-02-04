const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  affiliateLink: {
    type: String,
    required: true
  },
  clicked: {
    type: Number,
    dafault: 0,
  },
  lastClickedAt: Date,
  language: {
    type: String,
    enum: ['Hindi', 'Urdu', 'English'],
    default: 'Hindi'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

Book = mongoose.model('book', bookSchema);
module.exports = Book;
