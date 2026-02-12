const express = require('express');
const router = express.Router();
const poetOwnerController = require('../controllers/poetOwner.controller');
const poetOwnershipMiddleware = require('../middleware/poetOwnershipMiddleware');
const claimLimiter = require('../middleware/claimLimiter');


router.post('/claim', claimLimiter, poetOwnerController.submitClaim);
router.put('/poet/:poetId', poetOwnershipMiddleware, poetOwnerController.updatePoet);
router.post('/poet/:poetId/poems', poetOwnershipMiddleware, poetOwnerController.createPoem);
router.put('/poet/:poetId/poems/:poemId', poetOwnershipMiddleware, poetOwnerController.updatePoem);

module.exports = router;