const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },

    orderId: {
      type: String,
      unique: true,
      default: null
    },

    paymentId: {
      type: String,
      default: null
    },

    signature: {
      type: String,
      default: null
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    currency: {
      type: String,
      default: 'INR'
    },

    status: {
      type: String,
      enum: ['created', 'paid', 'failed', 'refunded'],
      default: 'created',
      index: true
    },

    purpose: {
      type: String,
      required: true
    },

    meta: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ user: 1, status: 1 });


const Payment = mongoose.model('payment', paymentSchema);
module.exports = Payment;