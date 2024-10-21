const { verifyToken } = require('../../Utils/jwtSecret');
const { User, Role, Permission } = require('../Models/Association');

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    try {
        const decoded = await verifyToken(token);
        const user = await User.findByPk(decoded.id, {
            include: [
                {
                    model: Role,
                    include: {
                        model: Permission,
                        through: { attributes: [] }
                    }
                }
            ]
        });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }
        const role = user.Role;
        const permissions = role.Permissions ? role.Permissions.map(permission => ({
            id: permission.id,
            name: permission.name
        })) : [];
        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: role.name,
            permissions: permissions
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
    }
};

module.exports = authMiddleware;
