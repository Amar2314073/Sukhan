const Payment = require('../models/payment');
const razorpayService = require('../services/razorpay.service');

/**
 * CREATE RAZORPAY ORDER
 * Flow:
 * 1. User authenticated (authMiddleware se)
 * 2. Amount + purpose validate
 * 3. DB me payment create (status: created)
 * 4. Razorpay order create
 * 5. orderId DB me update
 * 6. Frontend ko order details return
 */
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    let { amount, purpose } = req.body;

    // -----------------------------
    // BASIC VALIDATION
    // -----------------------------
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

    // -----------------------------
    // CONVERT TO PAISE (ATOMIC RULE)
    // -----------------------------
    const amountInPaise = Math.round(Number(amount) * 100);

    // -----------------------------
    // CREATE PAYMENT RECORD (DB FIRST)
    // -----------------------------
    const payment = await Payment.create({
      user: userId,
      amount: amountInPaise,
      currency: 'INR',
      purpose,
      status: 'created'
    });

    // -----------------------------
    // CREATE RAZORPAY ORDER
    // -----------------------------
    const order = await razorpayService.createOrder({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `pay_${payment._id}`
    });

    // -----------------------------
    // SAVE RAZORPAY ORDER ID
    // -----------------------------
    payment.orderId = order.id;
    await payment.save();

    // -----------------------------
    // SEND RESPONSE TO FRONTEND
    // -----------------------------
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
