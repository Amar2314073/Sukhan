const express = require('express');
const router = express.Router();

const razerpayWebhook = require('../webhooks/razorpay.webhook');


router.post('/razorpay', razerpayWebhook.handleWebhook);

module.exports = router;