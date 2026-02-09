const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    orderId: {
      type: String,
      required: true,
      unique: true
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
      enum: ['created', 'paid', 'failed'],
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

const Payment = mongoose.model('payment', paymentSchema);
module.exports = Payment;