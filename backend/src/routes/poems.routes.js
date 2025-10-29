const express = require('express');
const router = express.Router();
const poemController = require('../controllers/poems.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', poemController.getAllPoems);
router.get('/search', poemController.searchPoem);
router.get('/poet/:poetId', poemController.getPoemsByPoet);
router.get('/category/:categoryId', poemController.getPoemsByCategory);
router.get('/:id', poemController.getPoemById);
router.get('/featured', poemController.getFeaturedPoems);

// Admin only routes
router.post('/', adminMiddleware, poemController.createPoem);
router.put('/update/:id', adminMiddleware, poemController.updatePoem);
router.delete('/delete/:id', adminMiddleware, poemController.deletePoem);

module.exports = router;