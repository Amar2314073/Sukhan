const mongoose = require('mongoose');
const { Schema } = mongoose;


const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  type: {
    type: String,
    required: true,
    enum: ['sher', 'ghazal', 'nazm', 'rubai', "qit'a", 'free verse', 'other']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Category = mongoose.model('category', categorySchema);
module.exports = Category;