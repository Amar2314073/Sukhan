const crypto = require('crypto');
const Payment = require('../models/payment');




exports.handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // -----------------------------
    // VERIFY SIGNATURE
    // -----------------------------
    const razorpaySignature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      console.error('❌ Invalid Razorpay webhook signature');
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // -----------------------------
    // PARSE EVENT
    // -----------------------------
    const event = JSON.parse(req.body.toString());

    // -----------------------------
    // HANDLE EVENTS
    // -----------------------------
    switch (event.event) {

      // PAYMENT SUCCESS
      case 'payment.captured': {
        const paymentEntity = event.payload.payment.entity;

        const orderId = paymentEntity.order_id;
        const paymentId = paymentEntity.id;

        const payment = await Payment.findOneAndUpdate(
            {
                orderId,
                status: { $ne: 'paid' }
            },
            {
                $set: {
                status: 'paid',
                paymentId
                }
            },
            { new: true }
            );

            if (!payment) {
            break;
            }

            break;
        }

      // PAYMENT FAILED
      case 'payment.failed': {
        const paymentEntity = event.payload.payment.entity;
        const orderId = paymentEntity.order_id;

        await Payment.findOneAndUpdate(
            {
                orderId,
                status: { $ne: 'paid' }
            },
            {
                $set: { status: 'failed' }
            });

            break;
      }

      default:
        // Ignore other events
        break;
    }

    // -----------------------------
    // ACKNOWLEDGE RAZORPAY
    // -----------------------------
    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return res.status(500).json({ message: 'Webhook processing failed' });
  }
};
