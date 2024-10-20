const EmailService = require('../Services/email.Service');
const { JWT_CONFIG } = require('../../Utils/constants');
const { comparePassword } = require('../Helpers/hashPassword');
const { generateToken } = require('../../Utils/jwtSecret');
const { generateOTP } = require('../../Utils/OTP');
const { User } = require('../Models/Association');
const { Op } = require('sequelize');

const AuthService = {
  login: async (usernameOrEmail, password) => {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: usernameOrEmail },
          { username: usernameOrEmail }
        ]
      }
    });
    if (!user) throw new Error('Invalid credentials');
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) throw new Error('Invalid credentials');
    const token = generateToken(user);
    
    return { token, user };
  },

  changePassword: async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: userId } });
    await EmailService.sendPasswordChangeEmail(userId);
  },

  resetPassword: async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: userId } });
    await EmailService.sendPasswordChangeEmail(userId);
  },

  refreshToken: async (token) => {
    try {
      const decoded = jwt.verify(token, JWT_CONFIG.SECRET, { ignoreExpiration: true });
      const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, JWT_CONFIG.SECRET, {
        expiresIn: '1h',
      });
      return newToken;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  },
};

module.exports = AuthService;
