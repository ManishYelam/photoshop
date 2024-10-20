const express = require('express');
const userLogController = require('../Controllers/UserLogController');
const userLogRouter = express.Router();

userLogRouter
    .post('/', userLogController.createUserLog)
    .get('/', userLogController.getAllUserLogs)
    .get('/:id', userLogController.getUserLogById)
    .put('/:id', userLogController.updateUserLog)
    .delete('/:id', userLogController.deleteUserLog)
    .delete('/logs_range/:start_date/to/:end_date', userLogController.deleteLogsInRange)

module.exports = userLogRouter;
