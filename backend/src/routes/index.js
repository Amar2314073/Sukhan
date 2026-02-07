const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminOnlyMiddleware = require('../middleware/adminOnlyMiddleware');

router.use('/auth', require('./auth.routes'));
router.use('/poems', require('./poems.routes'));
router.use('/poets', require('./poets.routes'));
router.use('/favorites', authMiddleware, require('./favorites.routes'));
router.use('/categories', require('./categories.routes'));
router.use('/collections', require('./collections.routes'));
router.use('/userCollections', authMiddleware, require('./userCollections.routes'));
router.use('/ai', require('./ai.routes'));
router.use('/home', require('./home.routes'));
router.use('/comments', require('./comment.routes'));
router.use('/stats', require('./stat.routes'));
router.use('/books', require('./books.routes'));
router.use('/search', require('./search.routes'));
router.use('/sitemap', require('./sitemap.routes'));
router.use('/admin', authMiddleware, require('./admin.routes'));
router.use('/poetOwner', authMiddleware, adminOnlyMiddleware, require('./poetOwner.routes'));


module.exports = router;
