const express = require('express');
const router = express.Router();
const redisClient = require('../config/redis');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const authController = require('../controllers/auth.controller');



router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', userMiddleware, authController.logout);
router.post('/admin/register', adminMiddleware,authController.adminRegister);
router.get('/profile', userMiddleware, authController.getProfile)
router.delete('/profile', userMiddleware, authController.deleteProfile);
router.put('/profile', userMiddleware, authController.updateProfile);
router.put('/change-password', userMiddleware, authController.changePassword);
router.post('/like/:poemId', userMiddleware, authController.toggleLike);
router.post('/save/:poemId', userMiddleware, authController.toggleSave);
router.get('/loadUser', userMiddleware, authController.loadUser);
router.get('/likedPoems', userMiddleware, authController.getLikedPoems);
router.get('/savedPoems', userMiddleware, authController.getSavedPoems);


module.exports = router;