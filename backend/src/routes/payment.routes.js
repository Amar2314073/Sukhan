const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/create-order', authMiddleware, paymentController.createOrder);


module.exports = router;