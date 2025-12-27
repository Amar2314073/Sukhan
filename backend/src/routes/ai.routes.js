const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

/* -------- POEM CHAT -------- */
router.post('/poemChat', aiController.poemAIChat);

module.exports = router;