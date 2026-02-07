const express = require('express');
const router = express.Router();
const statController = require('../controllers/stat.controller');

router.get('/', statController.getStats);

module.exports = router;