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
router.get('/check', userMiddleware, authController.check);
router.put('/change-password', userMiddleware, authController.changePassword);
router.post('/like/:poemId', userMiddleware, authController.toggleLike);
router.post('/save/:poemId', userMiddleware, authController.toggleSave);


module.exports = router;