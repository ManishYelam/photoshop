const express = require('express');
const userController = require('../Controllers/UserController');
const validate = require('../Middlewares/validateMiddleware');
const { userSchema, userUpdateSchema } = require('../Middlewares/Joi_Validations/userSchema');
const userRouter = express.Router();

userRouter
    .post('/', validate(userSchema), userController.createUser)
    .get('/:userId/permissions/:permissionName', userController.checkUserPermission)
    .get('/', userController.getAllUsers)
    .get('/:id', userController.getUserById)
    .put('/:id', validate(userUpdateSchema), userController.updateUser)
    .delete('/:id', userController.deleteUser)
    .delete('/user_range/:start_id/to/:end_id', userController.deleteUserRanges)

module.exports = userRouter;
