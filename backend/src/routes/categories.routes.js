const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categories.controller');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/search', categoryController.searchCategories);
router.get('/stats/types', categoryController.getCategoryStats);
router.get('/type/:type', categoryController.getCategoriesByType);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/poems', categoryController.getPoemsByCategory);



module.exports = router;