const express = require('express');
const router = express.Router();
const statController = require('../controllers/stat.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', statController.getStats);
router.post('/reset', adminMiddleware, statController.resetStats);
router.post('/sync', adminMiddleware, statController.syncStats);

module.exports = router;