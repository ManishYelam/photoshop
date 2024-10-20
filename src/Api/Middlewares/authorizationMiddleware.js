const { User, Role, Permission } = require('./models'); // Adjust path accordingly

const authorizationMiddleware = (requiredPermission) => {
    return async (req, res, next) => {
        const userId = req.user.id; 

        try {
            const user = await User.findByPk(userId, {
                include: {
                    model: Role,
                    include: Permission 
                }
            });

            if (!user) {
                return res.status(403).json({ message: 'User not found.' });
            }

            const hasPermission = user.Role.Permissions.some(
                perm => perm.name === requiredPermission
            );

            if (!hasPermission) {
                return res.status(403).json({ message: 'Forbidden. You do not have permission to access this resource.' });
            }
            next(); 
        } catch (error) {
            console.error('Error checking permissions:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    };
};

module.exports = authorizationMiddleware;
