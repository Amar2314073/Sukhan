const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');


router.get('/poems', searchController.searchPoems);
router.get('/poets', searchController.searchPoets);
router.get('/books', searchController.searchBooks);
router.get('/collections', searchController.searchCollections);
router.get('/categories', searchController.searchCategories);

module.exports = router;