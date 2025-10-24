const express = require('express');
const router = express.Router();
const userCollectionController = require('../controllers/userCollections.controller');
const userMiddleware = require('../middleware/userMiddleware');

// All routes require user authentication
router.get('/', userMiddleware, userCollectionController.getUserCollections);
router.get('/search', userMiddleware, userCollectionController.searchUserCollections);
router.get('/stats/overview', userMiddleware, userCollectionController.getUserCollectionsStats);
router.get('/:id', userMiddleware, userCollectionController.getUserCollectionById);

router.post('/', userMiddleware, userCollectionController.createUserCollection);
router.post('/initialize-defaults', userMiddleware, userCollectionController.initializeDefaultCollections);
router.post('/:id/poems', userMiddleware, userCollectionController.addPoemToUserCollection);

router.put('/:id', userMiddleware, userCollectionController.updateUserCollection);

router.delete('/:id', userMiddleware, userCollectionController.deleteUserCollection);
router.delete('/:id/poems/:poemId', userMiddleware, userCollectionController.removePoemFromUserCollection);

module.exports = router;