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

// Admin only routes
router.post('/', adminMiddleware, poetController.createPoet);
router.put('/:id', adminMiddleware, poetController.updatePoet);
router.delete('/:id', adminMiddleware, poetController.deletePoet);

module.exports = router;