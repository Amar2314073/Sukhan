const razorpay = require('../config/razorpay');


//   Razorpay order create
//   @param {Number} amount - amount in paise (IMPORTANT)
//   @param {String} currency - INR
//   @param {String} receipt - internal receipt reference

exports.createOrder = async ({ amount, currency = 'INR', receipt }) => {
  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      payment_capture: 1
    });

    return order;
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    throw error;
  }
};
