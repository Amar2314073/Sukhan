const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuthMiddleware = require('../middleware/optionalAuthMiddleware')


router.post('/create-order', optionalAuthMiddleware, paymentController.createOrder);
router.get('/my', authMiddleware, paymentController.getMyPayments);
router.get('/:id', authMiddleware, paymentController.getPaymentById);

module.exports = router;