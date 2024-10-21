const { verifyToken } = require('../../Utils/jwtSecret'); 
const { User } = require('../Models/Association'); 

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    try {
        const decoded = await verifyToken(token); 
        const user = await User.findByPk(decoded.id); 
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }
        req.user = user;  // Attach the user to the request object for future use
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error in authMiddleware:', error); // Log detailed error for debugging
        return res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
    }
};

module.exports = authMiddleware;
