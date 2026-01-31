const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const adminController = require('../controllers/admin.controller');

/* -------- DASHBOARD -------- */
router.get('/dashboard', adminMiddleware, adminController.dashboard);

/* -------- POETS -------- */
router.get('/poets/search', adminMiddleware, adminController.searchPoets);
router.post('/poet', adminMiddleware, adminController.createPoet);
router.put('/poet/:id', adminMiddleware, adminController.updatePoet);
router.delete('/poet/:id', adminMiddleware, adminController.deletePoet);

/* -------- POEMS -------- */
router.post('/poem', adminMiddleware, adminController.createPoem);
router.put('/poem/:id', adminMiddleware, adminController.updatePoem);
router.delete('/poem/:id', adminMiddleware, adminController.deletePoem);

/* -------- Collections -------- */
router.get('/collections', adminMiddleware, adminController.getAllCollections);
router.post('/collection', adminMiddleware, adminController.createCollection);
router.put('/collection/:id', adminMiddleware, adminController.updateCollection);
router.delete('/collection/:id', adminMiddleware, adminController.deleteCollection);
router.put('/collection/:id/poems', adminMiddleware, adminController.addPoemToCollection);
router.delete('/collection/:id/poems', adminMiddleware, adminController.removePoemFromCollection);

module.exports = router;
