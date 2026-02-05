const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    trim: true,
    default: null
  },
  coverImage: {
    type: String,
    required: true
  },
  affiliateLink: {
    type: String,
    required: true
  },
  price:{
    type: Number,
    default: null
  },
  category:{
    type: String
  },
  clicks: {
    type: Number,
    default: 0
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

bookSchema.index({ clicks: -1 });
const Book = mongoose.model('book', bookSchema);
module.exports = Book;
