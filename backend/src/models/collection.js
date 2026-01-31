const mongoose = require('mongoose');
const { Schema } = mongoose;

const collectionSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Collection name is required'],
    trim: true,
    maxlength: [100, 'Collection name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  poems: [{
    type: Schema.Types.ObjectId,
    ref: 'poem'
  }],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category'
  },
  featured: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: ''
  },
  trending:{
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Collection = mongoose.model('collection', collectionSchema);
module.exports = Collection;