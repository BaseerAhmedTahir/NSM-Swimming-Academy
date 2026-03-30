"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.TokenExpiredError = exports.RateLimitError = exports.ConflictError = exports.NotFoundError = exports.ValidationError = exports.ForbiddenError = exports.UnauthorizedError = exports.AppError = void 0;
class AppError extends Error {
    code;
    statusCode;
    details;
    constructor(message, statusCode, code, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}
exports.AppError = AppError;
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', details) {
        super(message, 401, 'ERR_UNAUTHORIZED', details);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', details) {
        super(message, 403, 'ERR_FORBIDDEN', details);
    }
}
exports.ForbiddenError = ForbiddenError;
class ValidationError extends AppError {
    constructor(message = 'Validation Failed', details) {
        super(message, 400, 'ERR_VALIDATION_FAILED', details);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends AppError {
    constructor(message = 'Resource Not Found', details) {
        super(message, 404, 'ERR_NOT_FOUND', details);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message = 'Resource Conflict', details) {
        super(message, 409, 'ERR_CONFLICT', details);
    }
}
exports.ConflictError = ConflictError;
class RateLimitError extends AppError {
    constructor(message = 'Too Many Requests', details) {
        super(message, 429, 'ERR_RATE_LIMITED', details);
    }
}
exports.RateLimitError = RateLimitError;
class TokenExpiredError extends AppError {
    constructor(message = 'Token Expired', details) {
        super(message, 401, 'ERR_TOKEN_EXPIRED', details);
    }
}
exports.TokenExpiredError = TokenExpiredError;
class InternalServerError extends AppError {
    constructor(message = 'Internal Server Error', details) {
        super(message, 500, 'ERR_INTERNAL_SERVER', details);
    }
}
exports.InternalServerError = InternalServerError;
