const express = require('express');
const router = express.Router();
const adminOnlyMiddleware = require('../middleware/adminOnlyMiddleware');
const adminController = require('../controllers/admin.controller');

/* -------- DASHBOARD -------- */
router.get('/dashboard', adminController.dashboard);

/* -------- POETS -------- */
router.get('/poets/search', adminController.searchPoets);
router.post('/poet', adminController.createPoet);
router.put('/poet/:id', adminController.updatePoet);
router.delete('/poet/:id', adminController.deletePoet);

/* -------- POEMS -------- */
router.post('/poem', adminController.createPoem);
router.put('/poem/:id', adminController.updatePoem);
router.delete('/poem/:id', adminController.deletePoem);

/* -------- Collections -------- */
router.get('/collections', adminController.getAllCollections);
router.post('/collection', adminController.createCollection);
router.put('/collection/:id', adminController.updateCollection);
router.delete('/collection/:id', adminController.deleteCollection);
router.put('/collection/:id/poems', adminController.addPoemToCollection);
router.delete('/collection/:id/poems', adminController.removePoemFromCollection);

/* -------- Books -------- */
router.post('/books', adminController.createBook);
router.put('/books/:id', adminController.updateBook);
router.delete('/books/:id', adminController.deleteBook);


/* -------- Stats -------- */
router.post('/stats/reset', adminController.resetStats);
router.post('/stats/sync', adminController.syncStats);

/* -------- Categories -------- */
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);


/* -------- POET OWNERSHIP -------- */
router.get('/poet-owners', adminController.getAllPoetOwners);
router.get('/poet-ownership/requests', adminController.getPoetOwnershipRequests);
router.post('/poet-ownership/:requestId/approve', adminController.approvePoetOwnership);
router.post('/poet-ownership/:requestId/reject', adminController.rejectPoetOwnership);
router.post('/poet-ownership/:poetId/revoke-owner', adminController.revokePoetOwner);


/* -------- PAYMENTS -------- */
router.get('/payments', adminController.getAllPayments);
router.get('/payments/:id', adminController.getPaymentByIdAdmin);
router.post('/payments/refund', adminController.refundPayment);
router.get('/payments/stats', adminController.getPaymentStats);

module.exports = router;
