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

// Admin only routes
router.post('/', adminMiddleware, collectionController.createCollection);
router.put('/:id', adminMiddleware, collectionController.updateCollection);
router.delete('/:id', adminMiddleware, collectionController.deleteCollection);
router.post('/:id/poems', adminMiddleware, collectionController.addPoemToCollection);
router.delete('/:id/poems/:poemId', adminMiddleware, collectionController.removePoemFromCollection);

module.exports = router;