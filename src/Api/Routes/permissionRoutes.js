const express = require('express');
const permissionController = require('../Controllers/PermissionController');
const validate = require('../Middlewares/validateMiddleware');
const { permissionCreateSchema, permissionUpdateSchema } = require('../Middlewares/Joi_Validations/roleSchema');
const permissionRouter = express.Router();

permissionRouter
    .post('/', validate(permissionCreateSchema), permissionController.createPermission)
    .get('/', permissionController.getAllPermissions)
    .get('/:id', permissionController.getPermissionById)
    .put('/:id', validate(permissionUpdateSchema), permissionController.updatePermission)
    .delete('/:id', permissionController.deletePermission)

module.exports = permissionRouter;
