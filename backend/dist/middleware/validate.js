"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // Apply coerced/transformed body values back to req.body
            if (parsed && typeof parsed === 'object' && 'body' in parsed) {
                req.body = parsed.body;
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(422).json({
                    success: false,
                    message: 'Validation Failed',
                    errors: error.issues.map((e) => ({ field: e.path.join('.'), message: e.message }))
                });
            }
            next(error);
        }
    };
};
exports.validate = validate;
