const redisClient = require('../config/redis');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const userMiddleware = async (req, res, next) => {
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
        
        // Find user and check if active
        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Check if token is blacklisted - use consistent naming
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            return res.status(401).json({ message: "Token invalidated. Please login again." });
        }

        // Attach user to request
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

        res.status(401).json({ message: "Authentication failed" });
    }
}

module.exports = userMiddleware;