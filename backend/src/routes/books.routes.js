const express = require('express');
const router = express.Router();

const bookController = require('../controllers/books.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

/* PUBLIC */
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/:id/click', bookController.trackBookClick);

/* ADMIN */
router.post('/', adminMiddleware, bookController.createBook);
router.put('/:id', adminMiddleware, bookController.updateBook);
router.delete('/:id', adminMiddleware, bookController.deleteBook);

module.exports = router;
