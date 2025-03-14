// server/middleware/authMiddleware.js - Enhanced middleware

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Support both "Authorization: Bearer token" and "Authorization: token" formats
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "Authentication required. No token provided." });
        }
        
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : authHeader;
        
        if (!token) {
            return res.status(401).json({ message: "Authentication required. Invalid token format." });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: "Token expired. Please log in again." });
                }
                return res.status(401).json({ message: "Invalid token. Please log in again." });
            }
            
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ message: "Server error in authentication" });
    }
};

module.exports = authMiddleware;
