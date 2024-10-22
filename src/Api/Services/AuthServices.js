const { JWT_CONFIG } = require('../../Utils/constants');
const { comparePassword, hashPassword } = require('../Helpers/hashPassword');
const { generateToken } = require('../../Utils/jwtSecret');
const { generateOTP } = require('../../Utils/OTP');
const { User, Role, Permission, UserLog } = require('../Models/Association');
const { Op } = require('sequelize');
const EmailService = require('../Services/email.Service');

const AuthService = {
  login: async (usernameOrEmail, password, req, res) => {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: usernameOrEmail },
          { username: usernameOrEmail }
        ]
      },
      attributes: ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'date_of_birth', 'phone_number', 'address', 'status'],
      include: [{
        model: Role, attributes: ['id', 'name', 'description'],
        include:
          [{
            model: Permission,
            attributes: ['id', 'name'],
          }]
      }]
    });
    if (!user) throw new Error('Invalid credentials');

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) throw new Error('Invalid credentials');

    const role = user.Role;
    if (!role || !role.Permissions) {
      throw new Error('User role or permissions not found');
    }
    const permissionsArray = role.Permissions.map(permission => ({
      id: permission.id,
      name: permission.name,
    }));
    const token = generateToken(user, req, res);
    return { token, user, permissions: permissionsArray };
  },

  async logout(userId, token, ip) {
    // Optionally, blacklist the JWT if using a blacklist mechanism
    // await blacklistToken(token);

    // Log the logout event in the UserLog table
    await UserLog.create({
      userId,
      sourceIp: ip, // Get the IP address of the user
      logoffBy: 'USER',
      logoffAt: new Date(),
      jwtToken: token,
    });

    return { message: 'Successfully logged out' };
  },

  forgetPassword: async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const otp = generateOTP(); // Generate OTP
    user.otp = otp; // Save OTP to user record (make sure to have this field in your User model)
    await user.save();

    await EmailService.sendForgetPasswordEmail(user.id, otp); // Send email with OTP
    return { message: 'OTP sent to your email' };
  },

  changePassword: async (userId, oldPassword, newPassword) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const isMatch = await comparePassword(oldPassword, user.password);
      if (!isMatch) {
        throw new Error('Old password is incorrect');
      }
      const newHashedPassword = await hashPassword(newPassword, 10);
      
      await User.update({ password: newHashedPassword }, { where: { id: userId } });
      
      await EmailService.sendPasswordChangeEmail(userId);

      return { message: 'Password changed successfully' };
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error('Password change failed');
    }
  },

  // Reset Password and send confirmation email
  resetPassword: async (userId, newPassword) => {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.update({ password: hashedPassword }, { where: { id: userId } });
      await EmailService.sendPasswordChangeEmail(userId);  // Notify user about password reset
      return { message: 'Password reset successfully' };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw new Error('Password reset failed');
    }
  },

  // Refresh JWT token
  refreshToken: async (token) => {
    try {
      const decoded = jwt.verify(token, JWT_CONFIG.SECRET, { ignoreExpiration: true });

      // Generate a new token with the same user info (id and role)
      const newToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        JWT_CONFIG.SECRET,
        { expiresIn: '1h' }
      );

      return { token: newToken };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Token refresh failed');
    }
  }
}

module.exports = AuthService;
