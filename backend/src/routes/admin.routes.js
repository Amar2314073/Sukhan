const express = require('express');
const router = express.Router();
const adminOnlyMiddleware = require('../middleware/adminOnlyMiddleware');
const adminController = require('../controllers/admin.controller');

/* -------- DASHBOARD -------- */
router.get('/dashboard', adminOnlyMiddleware, adminController.dashboard);

/* -------- POETS -------- */
router.get('/poets/search', adminOnlyMiddleware, adminController.searchPoets);
router.post('/poet', adminOnlyMiddleware, adminController.createPoet);
router.put('/poet/:id', adminOnlyMiddleware, adminController.updatePoet);
router.delete('/poet/:id', adminOnlyMiddleware, adminController.deletePoet);

/* -------- POEMS -------- */
router.post('/poem', adminOnlyMiddleware, adminController.createPoem);
router.put('/poem/:id', adminOnlyMiddleware, adminController.updatePoem);
router.delete('/poem/:id', adminOnlyMiddleware, adminController.deletePoem);

/* -------- Collections -------- */
router.get('/collections', adminOnlyMiddleware, adminController.getAllCollections);
router.post('/collection', adminOnlyMiddleware, adminController.createCollection);
router.put('/collection/:id', adminOnlyMiddleware, adminController.updateCollection);
router.delete('/collection/:id', adminOnlyMiddleware, adminController.deleteCollection);
router.put('/collection/:id/poems', adminOnlyMiddleware, adminController.addPoemToCollection);
router.delete('/collection/:id/poems', adminOnlyMiddleware, adminController.removePoemFromCollection);

/* -------- Books -------- */
router.post('/books', adminOnlyMiddleware, adminController.createBook);
router.put('/books/:id', adminOnlyMiddleware, adminController.updateBook);
router.delete('/books/:id', adminOnlyMiddleware, adminController.deleteBook);


/* -------- Stats -------- */
router.post('/reset', adminOnlyMiddleware, adminController.resetStats);
router.post('/sync', adminOnlyMiddleware, adminController.syncStats);

/* -------- Categories -------- */
router.post('/categories', adminOnlyMiddleware, adminController.createCategory);
router.put('categories/:id', adminOnlyMiddleware, adminController.updateCategory);
router.delete('categories/:id', adminOnlyMiddleware, adminController.deleteCategory);

module.exports = router;
