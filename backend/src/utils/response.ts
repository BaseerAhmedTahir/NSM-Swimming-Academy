import { Response } from 'express';

interface SuccessResponseArgs<T> {
    res: Response;
    data?: T;
    message?: string;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        [key: string]: any;
    };
    statusCode?: number;
}

export const successResponse = <T>({ res, data, message, meta, statusCode = 200 }: SuccessResponseArgs<T>) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        meta
    });
};

interface ErrorResponseArgs {
    res: Response;
    code: string;
    message?: string;
    details?: any;
    statusCode?: number;
}

export const errorResponse = ({ res, code, message, details, statusCode = 500 }: ErrorResponseArgs) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: {
            code,
            details
        }
    });
};
