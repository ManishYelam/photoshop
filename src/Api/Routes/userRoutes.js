const express = require('express');
const userController = require('../Controllers/UserController');
const userRouter = express.Router();

userRouter
    .post('/', userController.createUser)
    .get('/:userId/permissions/:permissionName', userController.checkUserPermission)
    .get('/', userController.getAllUsers)
    .get('/:id', userController.getUserById)
    .put('/:id', userController.updateUser)
    .delete('/:id', userController.deleteUser)
    .delete('/user_range/:start_id/to/:end_id', userController.deleteUserRanges)

module.exports = userRouter;
