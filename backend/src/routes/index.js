const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/poems', require('./poems.routes'));
router.use('/poets', require('./poets.routes'));
router.use('/favorites', require('./favorites.routes'));
router.use('/categories', require('./categories.routes'));
router.use('/collections', require('./collections.routes'));
router.use('/userCollections', require('./userCollections.routes'));
router.use('/admin', require('./admin.routes'));
router.use('/ai', require('./ai.routes'));
router.use('/home', require('./home.routes'));
router.use('/comments', require('./comment.routes'));
router.use('/stats', require('./stat.routes'));
router.use('/books', require('./books.routes'));


module.exports = router;
