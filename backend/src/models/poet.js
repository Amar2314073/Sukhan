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
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    default: null
  },
  era: {
    type: String,
    required: [true, 'Era is required'],
    enum: ['Classical', 'Modern', 'Contemporary', 'Other']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    maxlength: [100, 'Country cannot exceed 100 characters'],
    trim: true
  },
  popular:{
    type: Boolean,
    default: false
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
  ownerAssignedAt: Date,
  ownerVerifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

poetSchema.index({ name: 1});

const Poet = mongoose.model('poet', poetSchema);
module.exports = Poet;