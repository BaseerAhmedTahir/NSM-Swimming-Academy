import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';

// Extend Express Request to include scopedBranchId
declare global {
    namespace Express {
        interface Request {
            scopedBranchId?: string;
        }
    }
}

/**
 * Branch scoping middleware.
 * - For STAFF: sets req.scopedBranchId to the user's branch. Controllers MUST use this.
 * - For SUPER_ADMIN: sets req.scopedBranchId to whatever branchId they pass in the query, or undefined for global access.
 */
export const branchScope = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next();
    }

    if (req.user.role === 'STAFF') {
        if (!req.user.branchId) {
            throw new UnauthorizedError('Corrupted session: Missing branch mapping. Please log out and log in again.');
        }
        // STAFF is always locked to their own branch - ignore whatever query param they send
        req.scopedBranchId = req.user.branchId;
    } else if (req.user.role === 'SUPER_ADMIN') {
        // SUPER_ADMIN can optionally filter by branch via query param
        req.scopedBranchId = (req.query.branchId as string) || undefined;
    }

    next();
};
