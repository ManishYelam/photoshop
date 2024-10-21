const express = require('express');
const authRouter = require('./authRoutes');
const roleRouter = require('./roleRoutes');
const permissionRouter = require('./permissionRoutes');
const userRouter = require('./userRoutes');
const userLogRouter = require('./userLogRoutes');
const authMiddleware = require('../Middlewares/authorizationMiddleware');

const router = express.Router();

router
  .use('/', authRouter)
  .use('/roles',authMiddleware, roleRouter)
  .use('/permissions',authMiddleware, permissionRouter)
  .use('/users',authMiddleware, userRouter)
  .use('/user_logs',authMiddleware, userLogRouter)

module.exports = router;
