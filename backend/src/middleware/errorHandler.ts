import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { errorResponse } from '../utils/response';
import { env } from '../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let code = 'ERR_INTERNAL_SERVER';
    let message = 'An unexpected error occurred';
    let details: any = undefined;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        code = err.code;
        message = err.message;
        details = err.details;
    } else if (err.name === 'ZodError') {
        statusCode = 400;
        code = 'ERR_VALIDATION_FAILED';
        message = 'Validation Failed';
        details = err.errors;
    } else if (err.code === 'P2002') {
        statusCode = 409;
        code = 'ERR_DUPLICATE_ENTRY';
        const target = (err.meta?.target as string[])?.join(', ') || 'field';
        message = `A record with this ${target} already exists.`;
    } else {
        // Log unhandled errors specifically
        console.error('🔥 [Unhandled Error]:', err);
        message = env.NODE_ENV === 'development' ? err.message : message;
        details = env.NODE_ENV === 'development' ? err.stack : undefined;
    }

    // Winston logger can be integrated here later
    // logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    return errorResponse({
        res,
        statusCode,
        code,
        message,
        details,
    });
};
