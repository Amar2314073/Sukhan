const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller');
const userMiddleware = require('../middleware/userMiddleware');

router.post('/:poemId', userMiddleware, favoritesController.addToFavorites);
router.delete('/:poemId', userMiddleware, favoritesController.removeFromFavorites);
router.get('/', userMiddleware, favoritesController.getUserFavorites);
router.get('/check/:poemId', userMiddleware, favoritesController.checkIfFavorited);
router.get('/stats', userMiddleware, favoritesController.getFavoritesStats);
router.get('/by-type/:type', userMiddleware, favoritesController.getFavoritesByType);
router.delete('/', userMiddleware, favoritesController.clearAllFavorites);

module.exports = router;