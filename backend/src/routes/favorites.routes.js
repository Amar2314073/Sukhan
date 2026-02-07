const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller');

router.post('/:poemId', favoritesController.addToFavorites);
router.delete('/:poemId', favoritesController.removeFromFavorites);
router.get('/', favoritesController.getUserFavorites);
router.get('/check/:poemId', favoritesController.checkIfFavorited);
router.get('/stats', favoritesController.getFavoritesStats);
router.get('/by-type/:type', favoritesController.getFavoritesByType);
router.delete('/', favoritesController.clearAllFavorites);

module.exports = router;