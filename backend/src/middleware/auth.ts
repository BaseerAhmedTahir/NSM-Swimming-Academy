import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../utils/errors';
import { prisma } from '../config/database';

export interface DecodedToken {
    id: string; // adminId or studentId
    role: string; // 'SUPER_ADMIN', 'STAFF', or 'STUDENT'
    branchId?: string; // Optional for SUPER_ADMIN
    permissions?: string[]; // Branch-specific allowed routes, embedded at login for STAFF
}

declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Authentication token is missing or invalid');
        }

        const token = authHeader.split(' ')[1];

        try {
            const secret = env.JWT_ACCESS_SECRET || process.env.JWT_ACCESS_SECRET;
            if (!secret) throw new Error("JWT_ACCESS_SECRET is not defined");
            const decoded = jwt.verify(token, secret) as DecodedToken;
            req.user = decoded;
            next();
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedError('ERR_TOKEN_EXPIRED', 'Your token has expired. Please refresh.');
            }
            throw new UnauthorizedError('Invalid authentication token');
        }
    } catch (error) {
        next(error);
    }
};
