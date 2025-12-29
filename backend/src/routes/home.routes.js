const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');

// Route for fetching stats
router.get('/stats', homeController.getStats);

module.exports = router;