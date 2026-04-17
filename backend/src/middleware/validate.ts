import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';

export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // Apply coerced/transformed body values back to req.body
            if (parsed && typeof parsed === 'object' && 'body' in parsed) {
                req.body = (parsed as any).body;
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(422).json({
                    success: false,
                    message: 'Validation Failed',
                    errors: error.issues.map((e: ZodIssue) => ({ field: e.path.join('.'), message: e.message }))
                });
            }
            next(error);
        }
    };
};

