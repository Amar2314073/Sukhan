const express = require('express');
const userMiddleware = require('../middleware/userMiddleware');
const router = express.Router();
const commentController = require('../controllers/comment.controller')

router.post('/post', userMiddleware, commentController.postComment);
router.get('/poem/:poemId', commentController.getPoemComments);
router.delete('/:id', userMiddleware, commentController.deleteComment);
router.put('/:id', userMiddleware, commentController.updateComment);

module.exports = router;