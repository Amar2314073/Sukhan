const mongoose = require('mongoose');
const { Schema } = mongoose;

const poetOwnershipRequestSchema = new Schema({
  poet: {
    type: Schema.Types.ObjectId,
    ref: 'poet',
    required: true
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  // User provided data
  claimantName: {
    type: String,
    required: true,
    trim: true
  },

  claimantEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    default: null
  },

  reviewedAt: Date,

}, { timestamps: true });

// ek user ek poet ke liye sirf ek active request
poetOwnershipRequestSchema.index(
  { poet: 1, user: 1, status: 1 },
  { unique: true }
);

const PoetOwnershipRequest =  mongoose.model('poetOwnershipRequest', poetOwnershipRequestSchema);

module.exports = PoetOwnershipRequest;
