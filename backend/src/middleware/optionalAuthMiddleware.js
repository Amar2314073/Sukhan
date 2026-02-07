const jwt = require('jsonwebtoken');
const User = require('../models/user');

const optionalAuthMiddleware = async (req, res, next) => {
  try {
    // COOKIE se token lo
    const token = req.cookies?.token;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await User.findById(decoded._id).select('_id role');

    req.user = user || null;
    next();

  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = optionalAuthMiddleware;
