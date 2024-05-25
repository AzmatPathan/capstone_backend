import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import db from '../config/db.js';

// User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Read JWT from the 'jwt' cookie
    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Fetch user information from the database using MySQL query
            const [rows] = await db.query('SELECT * FROM Users WHERE user_id = ?', [decoded.user.user_id]);

            if (rows.length === 0) {
                throw new Error('User not found');
            }

            // Store user information in the request object
            req.user = rows[0];

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// User must be an admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

export { protect, admin };
