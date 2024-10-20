const jwt = require('jsonwebtoken');
const { JWT_CONFIG } = require('./constants');
const UserLog = require('../Api/Models/user_logs');

// Generate a new JWT token
const generateToken = (user, secret = JWT_CONFIG.SECRET) => {
    const payload = {
        id: user.id,  // Ensure this is the correct user ID
        role: user.role, // Add other fields as necessary
    };
    try {
        const token = jwt.sign(payload, secret, { expiresIn: JWT_CONFIG.EXPIRATION, algorithm: 'HS256' });
        return token;

        // Save log with token
         UserLog.create({
            userId: user.id,
            jwtToken: token,
            sourceIp: req.ip
        });

        res.cookie('token', token, { httpOnly: true, secure: true });

    } catch (error) {
        throw new Error('Token generation failed');
    }
};

// Verify a JWT token
const verifyToken = (token, secret = JWT_CONFIG.SECRET) => {
    try {
        const decoded = jwt.verify(token, secret);
        console.log('JWT verified:', { userId: decoded.user.id });
        return decoded;
    } catch (error) {
        console.error('Error verifying JWT token:', error);
        throw new Error('Token verification failed');
    }
};

// Decode a JWT token without verification (just extract the payload)
const decodeToken = (token) => {
    try {
        const decoded = jwt.decode(token);
        console.log('JWT decoded without verification:', { decoded });
        return decoded;
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        throw new Error('Token decoding failed');
    }
};

// Refresh an existing JWT token (create a new token with the same user info)
const refreshToken = (token, secret = JWT_CONFIG.SECRET) => {
    try {
        const decoded = jwt.verify(token, secret, { ignoreExpiration: true });
        const newToken = generateToken(decoded.user, secret);  // Use the same user info for the new token
        console.log('JWT refreshed:', { userId: decoded.user.id });
        return newToken;
    } catch (error) {
        console.error('Error refreshing JWT token:', error);
        throw new Error('Token refresh failed');
    }
};

// Check if a token is expired by comparing the current time with the expiration
const isTokenExpired = (token) => {
    try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) {
            throw new Error('Invalid token format');
        }
        return Date.now() >= decoded.exp * 1000; // Check if the current time is past the expiration time
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true;  // If an error occurs, assume the token is expired
    }
};

// Export all functions for use in other modules
module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
    refreshToken,
    isTokenExpired,
};
