const express = require('express');
const router = express.Router();
const userCollectionController = require('../controllers/userCollections.controller');

// All routes require user authentication
router.get('/', userCollectionController.getUserCollections);
router.get('/search', userCollectionController.searchUserCollections);
router.get('/stats/overview', userCollectionController.getUserCollectionsStats);
router.get('/:id', userCollectionController.getUserCollectionById);

router.post('/', userCollectionController.createUserCollection);
router.post('/initialize-defaults', userCollectionController.initializeDefaultCollections);
router.post('/:id/poems', userCollectionController.addPoemToUserCollection);

router.put('/:id', userCollectionController.updateUserCollection);

router.delete('/:id', userCollectionController.deleteUserCollection);
router.delete('/:id/poems/:poemId', userCollectionController.removePoemFromUserCollection);

module.exports = router;