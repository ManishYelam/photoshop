const express = require('express');
const AuthController = require('../Controllers/AuthController');
const authMiddleware = require('../Middlewares/authMiddleware'); // Adjust path accordingly

const authRouter = express.Router();
authRouter
.post('/login', AuthController.login)
// .post('/logout', authMiddleware, AuthController.logout)
// .post('/forget-password', AuthController.forgetPassword)
.post('/reset-password', AuthController.resetPassword)
.post('/change-password', authMiddleware, AuthController.changePassword)
.post('/refresh-token', AuthController.refreshToken)

module.exports = authRouter;
