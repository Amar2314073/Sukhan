const mongoose = require('mongoose');
const { Schema } = mongoose;

const poemSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    urdu: {
      type: String,
      required: [true, 'Urdu content is required']
    },
    hindi: {
      type: String,
      required: [true, 'Hindi content is required']
    },
    roman: {
      type: String,
      required: [true, 'Roman content is required']
    }
  },
  poet: {
    type: Schema.Types.ObjectId,
    ref: 'poet',
    required: [true, 'Poet reference is required']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: [true, 'Category reference is required']
  },
  featured:{
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better search performance
poemSchema.index({ title: 'text', 'content.urdu': 'text', 'content.hindi': 'text', 'content.roman': 'text' });

const Poem = mongoose.model('poem', poemSchema);
module.exports = Poem;