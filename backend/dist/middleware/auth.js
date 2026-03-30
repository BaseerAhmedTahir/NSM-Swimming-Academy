"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const errors_1 = require("../utils/errors");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_1.UnauthorizedError('Authentication token is missing or invalid');
        }
        const token = authHeader.split(' ')[1];
        try {
            const secret = env_1.env.JWT_ACCESS_SECRET || process.env.JWT_ACCESS_SECRET;
            if (!secret)
                throw new Error("JWT_ACCESS_SECRET is not defined");
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            req.user = decoded;
            next();
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new errors_1.UnauthorizedError('ERR_TOKEN_EXPIRED', 'Your token has expired. Please refresh.');
            }
            throw new errors_1.UnauthorizedError('Invalid authentication token');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
