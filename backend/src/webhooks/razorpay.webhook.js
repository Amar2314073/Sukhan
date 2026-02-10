const crypto = require('crypto');
const Payment = require('../models/payment');

exports.handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    /* ---------------- VERIFY SIGNATURE ---------------- */
    const razorpaySignature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    /* ---------------- PARSE EVENT ---------------- */
    const event = JSON.parse(req.body.toString());

    /* ---------------- HANDLE EVENTS ---------------- */
    switch (event.event) {

      /* ---------- PAYMENT CAPTURED ---------- */
      case 'payment.captured': {
        const payment = event.payload.payment.entity;

        await Payment.findOneAndUpdate(
          {
            orderId: payment.order_id,
            status: { $ne: 'paid' }   // idempotency
          },
          {
            $set: {
              status: 'paid',
              paymentId: payment.id,
              meta: payment
            }
          }
        );
        break;
      }

      /* ---------- ORDER PAID (FINAL CONFIRMATION) ---------- */
      case 'order.paid': {
        const order = event.payload.order.entity;

        await Payment.findOneAndUpdate(
          {
            orderId: order.id,
            status: { $ne: 'paid' }
          },
          {
            $set: {
              status: 'paid',
              meta: order
            }
          }
        );
        break;
      }

      /* ---------- PAYMENT FAILED ---------- */
      case 'payment.failed': {
        const payment = event.payload.payment.entity;

        await Payment.findOneAndUpdate(
          {
            orderId: payment.order_id,
            status: { $ne: 'paid' }
          },
          {
            $set: {
              status: 'failed',
              meta: payment
            }
          }
        );
        break;
      }

      /* ---------- REFUND PROCESSED ---------- */
      case 'refund.processed': {
        const refund = event.payload.refund.entity;

        await Payment.findOneAndUpdate(
          {
            paymentId: refund.payment_id,
            status: 'paid'
          },
          {
            $set: {
              status: 'refunded',
              meta: refund
            }
          }
        );
        break;
      }

      /* ---------- REFUND FAILED ---------- */
      case 'refund.failed': {
        const refund = event.payload.refund.entity;

        await Payment.findOneAndUpdate(
          {
            paymentId: refund.payment_id
          },
          {
            $set: {
              meta: refund   // payment remains PAID
            }
          }
        );
        break;
      }

      /* ---------- IGNORE ALL OTHER EVENTS ---------- */
      default:
        break;
    }

    /* ---------------- ACKNOWLEDGE RAZORPAY ---------------- */
    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return res.status(500).json({ message: 'Webhook processing failed' });
  }
};
