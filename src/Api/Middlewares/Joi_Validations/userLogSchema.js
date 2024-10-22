const Joi = require('joi');

const userLogCreateSchema = Joi.object({
    userId: Joi.number().integer().positive().optional()
        .messages({
            'number.base': 'User ID must be a number',
            'number.integer': 'User ID must be an integer',
            'number.positive': 'User ID must be a positive integer',
        }),
    sourceIp: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).required()
        .messages({
            'string.base': 'Source IP must be a string',
            'string.empty': 'Source IP is required',
            'string.ip': 'Source IP must be a valid IP address',
        }),
    relatedInfo: Joi.string().max(500).optional()
        .messages({
            'string.base': 'Related Info must be a string',
            'string.max': 'Related Info must be at most 500 characters long',
        }),
    logoffBy: Joi.string().valid('SYSTEM', 'USER').optional()
        .messages({
            'string.base': 'Logoff By must be a string',
            'any.only': 'Logoff By must be either SYSTEM or USER',
        }),
    logoffAt: Joi.date().optional()
        .messages({
            'date.base': 'Logoff At must be a valid date',
        }),
    loginAt: Joi.date().optional()
        .messages({
            'date.base': 'Login At must be a valid date',
        }),
    jwtToken: Joi.string().required()
        .messages({
            'string.base': 'JWT Token must be a string',
            'string.empty': 'JWT Token is required',
        }),
    createdAt: Joi.date().optional()
        .messages({
            'date.base': 'Created At must be a valid date',
        }),
});

// Schema for updating an existing UserLog
const userLogUpdateSchema = Joi.object({
    userId: Joi.number().integer().positive().optional()
        .messages({
            'number.base': 'User ID must be a number',
            'number.integer': 'User ID must be an integer',
            'number.positive': 'User ID must be a positive integer',
        }),
    sourceIp: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).optional()
        .messages({
            'string.base': 'Source IP must be a string',
            'string.ip': 'Source IP must be a valid IP address',
        }),
    relatedInfo: Joi.string().max(500).optional()
        .messages({
            'string.base': 'Related Info must be a string',
            'string.max': 'Related Info must be at most 500 characters long',
        }),
    logoffBy: Joi.string().valid('SYSTEM', 'USER').optional()
        .messages({
            'string.base': 'Logoff By must be a string',
            'any.only': 'Logoff By must be either SYSTEM or USER',
        }),
    logoffAt: Joi.date().optional()
        .messages({
            'date.base': 'Logoff At must be a valid date',
        }),
    loginAt: Joi.date().optional()
        .messages({
            'date.base': 'Login At must be a valid date',
        }),
    jwtToken: Joi.string().optional()
        .messages({
            'string.base': 'JWT Token must be a string',
        }),
    createdAt: Joi.date().optional()
        .messages({
            'date.base': 'Created At must be a valid date',
        }),
});

// Schema for querying UserLogs
const userLogQuerySchema = Joi.object({
    id: Joi.string().guid({ version: 'uuidv4' }).optional()
        .messages({
            'string.base': 'ID must be a string',
            'string.guid': 'ID must be a valid UUID',
        }),
    userId: Joi.number().integer().positive().optional()
        .messages({
            'number.base': 'User ID must be a number',
            'number.integer': 'User ID must be an integer',
            'number.positive': 'User ID must be a positive integer',
        }),
    sourceIp: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).optional()
        .messages({
            'string.base': 'Source IP must be a string',
            'string.ip': 'Source IP must be a valid IP address',
        }),
    logoffBy: Joi.string().valid('SYSTEM', 'USER').optional()
        .messages({
            'string.base': 'Logoff By must be a string',
            'any.only': 'Logoff By must be either SYSTEM or USER',
        }),
    createdAt: Joi.date().optional()
        .messages({
            'date.base': 'Created At must be a valid date',
        }),
});

module.exports = {
    userLogCreateSchema,
    userLogUpdateSchema,
    userLogQuerySchema,
};
