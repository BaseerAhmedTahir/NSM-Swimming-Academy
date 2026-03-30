"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const env_1 = require("../config/env");
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let code = 'ERR_INTERNAL_SERVER';
    let message = 'An unexpected error occurred';
    let details = undefined;
    if (err instanceof errors_1.AppError) {
        statusCode = err.statusCode;
        code = err.code;
        message = err.message;
        details = err.details;
    }
    else if (err.name === 'ZodError') {
        statusCode = 400;
        code = 'ERR_VALIDATION_FAILED';
        message = 'Validation Failed';
        details = err.errors;
    }
    else if (err.code === 'P2002') {
        statusCode = 409;
        code = 'ERR_DUPLICATE_ENTRY';
        const target = err.meta?.target?.join(', ') || 'field';
        message = `A record with this ${target} already exists.`;
    }
    else {
        // Log unhandled errors specifically
        console.error('🔥 [Unhandled Error]:', err);
        message = env_1.env.NODE_ENV === 'development' ? err.message : message;
        details = env_1.env.NODE_ENV === 'development' ? err.stack : undefined;
    }
    // Winston logger can be integrated here later
    // logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return (0, response_1.errorResponse)({
        res,
        statusCode,
        code,
        message,
        details,
    });
};
exports.errorHandler = errorHandler;
