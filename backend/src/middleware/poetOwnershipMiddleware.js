const Poet = require('../models/poet');

const poetOwnershipMiddleware = async (req, res, next) => {
  try {
    const poetId =
      req.body.poetId ||
      req.params.poetId ||
      req.query.poetId;

    if (!poetId) {
      return res.status(400).json({
        message: 'Poet ID is required'
      });
    }

    const poet = await Poet.findById(poetId);

    if (!poet || !poet.isActive) {
      return res.status(404).json({
        message: 'Poet not found'
      });
    }

    // Admin → always allowed
    if (req.user.role === 'admin') {
      req.poet = poet;
      return next();
    }

    // Owner check
    if (
      poet.owner &&
      poet.owner.toString() === req.user._id.toString()
    ) {
      req.poet = poet;
      return next();
    }

    return res.status(403).json({
      message: 'You are not authorized to manage this poet'
    });

  } catch (error) {
    console.error('Poet ownership middleware error:', error);
    return res.status(500).json({
      message: 'Failed to verify poet ownership'
    });
  }
};

module.exports = poetOwnershipMiddleware;
