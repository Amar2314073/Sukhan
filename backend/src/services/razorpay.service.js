const razorpay = require('../config/razorpay');


exports.createOrder = async ({ amount, currency = 'INR', receipt }) => {
  if(!amount || amount <= 0) {
    throw new Error('Invalid amount for Razorpay order')
  }
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

exports.fetchPayment = async (paymentId) => {
  if(!paymentId) {
    throw new Error('paymentId is required to fetch payment')
  }
  try{

    return await razorpay.payments.fetch(paymentId);

  } catch(error) {
    console.error('Razorpay fetch payment failed', error);
    throw error;
  }
}

exports.refundPayment = async ({paymentId, amount}) => {
  if(!paymentId) {
    throw new Error('paymentId is required to for refund')
  }
  try{

    const refundData = amount
      ? { amount } // partial refund (paise)
      : {};        // full refund

    return razorpay.payments.refund(paymentId, refundData)

  } catch(error) {
    console.error('Razorpay refund failed', error);
    throw error;
  }
}

exports.fetchOrder = async (orderId) => {
  if(!orderId) {
    throw new Error('orderId is required to fetch order')
  }
  try{

    return await razorpay.orders.fetch(orderId);

  } catch(error) {
    console.error('Razorpay fetch payment failed', error);
    throw error;
  }
}