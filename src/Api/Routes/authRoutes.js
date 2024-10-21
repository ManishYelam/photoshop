const express = require('express');
const AuthController = require('../Controllers/AuthController');
const authMiddleware = require('../Middlewares/authorizationMiddleware');

const authRouter = express.Router();
authRouter
.post('/login', AuthController.login)
// .post('/logout', authMiddleware, AuthController.logout)
// .post('/forget-password', AuthController.forgetPassword)
.post('/reset-password', authMiddleware, AuthController.resetPassword)
.post('/change-password', authMiddleware, AuthController.changePassword)
.post('/refresh-token',authMiddleware, AuthController.refreshToken)

module.exports = authRouter;
