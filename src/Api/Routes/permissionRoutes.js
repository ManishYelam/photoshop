const express = require('express');
const permissionController = require('../Controllers/PermissionController');
const permissionRouter = express.Router();

permissionRouter
    .post('/', permissionController.createPermission)
    .get('/', permissionController.getAllPermissions)
    .get('/:id', permissionController.getPermissionById)
    .put('/:id', permissionController.updatePermission)
    .delete('/:id', permissionController.deletePermission)

module.exports = permissionRouter;
