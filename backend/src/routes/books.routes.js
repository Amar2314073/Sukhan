const express = require('express');
const router = express.Router();

const bookController = require('../controllers/books.controller');

/* PUBLIC */
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/:id/click', bookController.trackBookClick);
router.get('/trending', bookController.getTrendingBooks);

module.exports = router;
