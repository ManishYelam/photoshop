const AuthService = require('../Services/AuthServices');

const AuthController = {
  login: async (req, res) => {
    try {
      const { token, user } = await AuthService.login(req.body.usernameOrEmail, req.body.password);
      res.status(200).json({ token, user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  changePassword: async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
      await AuthService.changePassword(req.user.id, oldPassword, newPassword);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      await AuthService.resetPassword(req.user.id, req.body.newPassword);
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const newToken = await AuthService.refreshToken(req.body.token);
      res.status(200).json({ token: newToken });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = AuthController;
