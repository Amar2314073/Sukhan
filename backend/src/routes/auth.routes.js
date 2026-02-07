const express = require('express');
const router = express.Router();
const redisClient = require('../config/redis');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnlyMiddleware = require('../middleware/adminOnlyMiddleware');



router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.post('/admin/register', adminOnlyMiddleware,authController.adminRegister);
router.get('/profile', authMiddleware, authController.getProfile)
router.delete('/profile', authMiddleware, authController.deleteProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);
router.post('/like/:poemId', authMiddleware, authController.toggleLike);
router.post('/save/:poemId', authMiddleware, authController.toggleSave);
router.get('/loadUser', authMiddleware, authController.loadUser);
router.get('/likedPoems', authMiddleware, authController.getLikedPoems);
router.get('/savedPoems', authMiddleware, authController.getSavedPoems);


module.exports = router;