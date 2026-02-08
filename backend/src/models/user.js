const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [30, 'Name cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },

  // Profile Information
  avatar: {
    type: String,
    default: 'https://www.gravatar.com/avatar/?d=mp&s=200'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters'],
    default: ''
  },

  // Preferences
  preferredLanguage: {
    type: String,
    enum: ['hindi', 'roman'],
    default: 'hindi'
  },
  notificationSettings: {
    emailNotifications: { type: Boolean, default: true },
    newContentAlerts: { type: Boolean, default: true }
  },

  // Account Status
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPoetOwner: {
    type: Boolean,
    default: false
  },
  ownedPoet: {
    type: Schema.Types.ObjectId,
    ref: 'poet',
    default: null
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },

  likedPoems: [{
    type: Schema.Types.ObjectId,
    ref: 'poem'
  }],

  savedPoems: [{
    type: Schema.Types.ObjectId,
    ref: 'poem'
  }],

  collections: [{
    type: Schema.Types.ObjectId,
    ref: 'collection'
  }]
}, {
  timestamps: true
});

// Method to get public profile (exclude password)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('user', userSchema);
module.exports = User;