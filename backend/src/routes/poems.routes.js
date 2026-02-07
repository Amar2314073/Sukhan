const express = require('express');
const router = express.Router();
const poemController = require('../controllers/poems.controller');

// Public routes
router.get('/', poemController.getAllPoems);
router.get('/search', poemController.searchPoem);
router.get('/poet/:poetId', poemController.getPoemsByPoet);
router.get('/category/:categoryId', poemController.getPoemsByCategory);
router.get('/:id', poemController.getPoemById);
router.get('/featured', poemController.getFeaturedPoems);


module.exports = router;