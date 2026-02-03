const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');

// Route for fetching stats
router.get('/stats', homeController.getStats);
router.get('/', homeController.getHomePage);
router.get('/random', homeController.getRandomPoems);
router.get('/random/sher', homeController.getRandomSher);
router.get('/random/freeverse', homeController.getRandomFreeVerse);
router.get('/random/ghazal', homeController.getRandomGhazal);
router.get('/random/collection')

module.exports = router;