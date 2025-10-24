const redisClient = require('../config/redis');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const adminMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        // Verify token
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id, role } = payload;
        
        if (!_id) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Admin verification - check payload first (faster)
        if (role !== 'admin') {
            return res.status(403).json({ message: "Admin access required" });
        }

        // Find user and check if active
        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Double-check role from database for security
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Admin access required" });
        }

        // Check if token is blacklisted
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            return res.status(401).json({ message: "Token invalidated. Please login again." });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Admin middleware error:", error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }

        res.status(401).json({ message: "Authentication failed" });
    }
}

module.exports = adminMiddleware;