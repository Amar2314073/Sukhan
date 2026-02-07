const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/post', authMiddleware, commentController.postComment);
router.get('/poem/:poemId', commentController.getPoemComments);
router.delete('/:id', authMiddleware, commentController.deleteComment);
router.put('/:id', authMiddleware, commentController.updateComment);

module.exports = router;