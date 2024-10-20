const express = require('express');
const roleController = require('../Controllers/RoleController');
const roleRouter = express.Router();

roleRouter
    .post('/', roleController.createRole)
    .post('/:roleId/permissions', roleController.assignPermissionsToRole)
    .get('/', roleController.getAllRoles)
    .get('/:id', roleController.getRoleById)
    .put('/:id', roleController.updateRole)
    .delete('/:id', roleController.deleteRole)

module.exports = roleRouter;

