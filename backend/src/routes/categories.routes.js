const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categories.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/search', categoryController.searchCategories);
router.get('/stats/types', categoryController.getCategoryStats);
router.get('/type/:type', categoryController.getCategoriesByType);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/poems', categoryController.getPoemsByCategory);

// Admin only routes
router.post('/', adminMiddleware, categoryController.createCategory);
router.put('/:id', adminMiddleware, categoryController.updateCategory);
router.delete('/:id', adminMiddleware, categoryController.deleteCategory);

module.exports = router;