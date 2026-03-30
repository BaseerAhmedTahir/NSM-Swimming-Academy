export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly details?: any;

    constructor(message: string, statusCode: number, code: string, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized', details?: any) {
        super(message, 401, 'ERR_UNAUTHORIZED', details);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden', details?: any) {
        super(message, 403, 'ERR_FORBIDDEN', details);
    }
}

export class ValidationError extends AppError {
    constructor(message: string = 'Validation Failed', details?: any) {
        super(message, 400, 'ERR_VALIDATION_FAILED', details);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource Not Found', details?: any) {
        super(message, 404, 'ERR_NOT_FOUND', details);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Resource Conflict', details?: any) {
        super(message, 409, 'ERR_CONFLICT', details);
    }
}

export class RateLimitError extends AppError {
    constructor(message: string = 'Too Many Requests', details?: any) {
        super(message, 429, 'ERR_RATE_LIMITED', details);
    }
}

export class TokenExpiredError extends AppError {
    constructor(message: string = 'Token Expired', details?: any) {
        super(message, 401, 'ERR_TOKEN_EXPIRED', details);
    }
}

export class InternalServerError extends AppError {
    constructor(message: string = 'Internal Server Error', details?: any) {
        super(message, 500, 'ERR_INTERNAL_SERVER', details);
    }
}
