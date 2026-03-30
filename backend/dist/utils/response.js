"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = ({ res, data, message, meta, statusCode = 200 }) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        meta
    });
};
exports.successResponse = successResponse;
const errorResponse = ({ res, code, message, details, statusCode = 500 }) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: {
            code,
            details
        }
    });
};
exports.errorResponse = errorResponse;
