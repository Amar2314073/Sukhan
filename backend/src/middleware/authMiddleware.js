const redisClient = require('../config/redis');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_KEY);
    const { _id } = payload;

    if (!_id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Check blacklist
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) {
      return res.status(401).json({
        message: "Token invalidated. Please login again."
      });
    }

    // Find user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user
    req.user = user;
    next();

  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = authMiddleware;
