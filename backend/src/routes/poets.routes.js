const express = require('express');
const router = express.Router();
const poetController = require('../controllers/poets.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', poetController.getAllPoets);
router.get('/search', poetController.searchPoets);
router.get('/era/:era', poetController.getPoetsByEra);
router.get('/:id', poetController.getPoetById);
router.get('/:id/poems', poetController.getPoemsByPoet);
router.get('/popular', poetController.getPopularPoets);


module.exports = router;