const mongoose = require('mongoose');
const { Schema } = mongoose;

const userCollectionSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Collection name is required'],
    trim: true,
    maxlength: [100, 'Collection name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [300, 'Description cannot exceed 300 characters'],
    default: ''
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User reference is required']
  },
  poems: [{
    type: Schema.Types.ObjectId,
    ref: 'poem'
  }],
  type: {
    type: String,
    enum: ['sher', 'ghazal', 'nazm', 'mixed'],
    default: 'mixed'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const UserCollection = mongoose.model('userCollection', userCollectionSchema);
module.exports = UserCollection;