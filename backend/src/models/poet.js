const mongoose = require('mongoose');
const { Schema } = mongoose;

const poetSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Poet name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    maxlength: [2000, 'Bio cannot exceed 2000 characters']
  },
  era: {
    type: String,
    required: [true, 'Era is required'],
    enum: ['Classical', 'Modern', 'Contemporary']
  },
  birthYear: {
    type: Number
  },
  deathYear: {
    type: Number
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Poet = mongoose.model('poet', poetSchema);
module.exports = Poet;