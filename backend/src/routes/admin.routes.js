const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const adminController = require('../controllers/admin.controller');

/* -------- DASHBOARD -------- */
router.get('/dashboard', adminMiddleware, adminController.dashboard);

/* -------- POETS -------- */
router.post('/poet', adminMiddleware, adminController.createPoet);
router.put('/poet/:id', adminMiddleware, adminController.updatePoet);
router.delete('/poet/:id', adminMiddleware, adminController.deletePoet);

/* -------- POEMS -------- */
router.post('/poem', adminMiddleware, adminController.createPoem);
router.put('/poem/:id', adminMiddleware, adminController.updatePoem);
router.delete('/poem/:id', adminMiddleware, adminController.deletePoem);

module.exports = router;
