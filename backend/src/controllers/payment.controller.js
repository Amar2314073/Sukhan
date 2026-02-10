const Payment = require('../models/payment');
const razorpayService = require('../services/razorpay.service');


exports.createOrder = async (req, res) => {
  try {

    let { amount, purpose } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: 'Invalid amount'
      });
    }

    if (!purpose) {
      return res.status(400).json({
        message: 'Payment purpose is required'
      });
    }

    if (purpose !== 'public' && !req.user) {
      return res.status(401).json({ message: 'Login required' });
    }

    const userId = req.user ? req.user._id : null
    const amountInPaise = Math.round(Number(amount) * 100);

    const payment = await Payment.create({
      user: userId,
      amount: amountInPaise,
      currency: 'INR',
      purpose,
      status: 'created'
    });

    // creating razorpay order
    const order = await razorpayService.createOrder({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `pay_${payment._id}`
    });

    
    payment.orderId = order.id;
    await payment.save();

    // send response to frontend
    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      },
      paymentId: payment._id
    });

  } catch (error) {
    console.error('Create order error:', error);

    return res.status(500).json({
      message: 'Failed to create payment order'
    });
  }
};

exports.getMyPayments = async (req, res) => {
  try {

    const payments = await Payment.find({ user: req.user._id })
    .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, payments})
    
  } catch(error) {
    return res.status(500).json({ message: 'Failed to fetch payments' });
  }
}

exports.getPaymentById = async (req, res) => {
  try {

    const payment = await Payment.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    })
    
    if(!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    return res.status(200).json({ success: true, payment})
    
  } catch(error) {
    return res.status(500).json({ message: 'Failed to fetch payment' });
  }
}
