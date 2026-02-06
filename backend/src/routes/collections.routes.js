const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collections.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', collectionController.getAllCollections);
router.get('/featured', collectionController.getFeaturedCollections);
router.get('/search', collectionController.searchCollections);
router.get('/stats/overview', collectionController.getCollectionsStats);
router.get('/category/:categoryId', collectionController.getCollectionsByCategory);
router.get('/:id', collectionController.getCollectionById);
router.get('/trending', collectionController.getTrendingCollections);


module.exports = router;