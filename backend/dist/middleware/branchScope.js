"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchScope = void 0;
/**
 * Ensures that whenever a Branch ID is required or a query is made,
 * it is scoped strictly to the Admin's corresponding branchId.
 * Does not limit SUPER_ADMIN globally if they specify a branchId,
 * but auto-injects if missing.
 */
const branchScope = (req, res, next) => {
    if (req.user && (req.user.role === 'STAFF' || req.user.role === 'SUPER_ADMIN')) {
        // If the user hasn't explicitly queried a branch, or if they are STAFF, force the branch boundary
        if (req.user.role === 'STAFF') {
            if (req.query)
                req.query.branchId = req.user.branchId;
            if (req.body)
                req.body.branchId = req.user.branchId;
        }
        else if (req.user.role === 'SUPER_ADMIN') {
            const hasQueryBranch = req.query && req.query.branchId;
            const hasBodyBranch = req.body && req.body.branchId;
            if (!hasQueryBranch && !hasBodyBranch) {
                // Optional: Auto scope super admin if they don't explicitly ask for a specific branch
                // if (req.query) req.query.branchId = req.user.branchId;
            }
        }
    }
    next();
};
exports.branchScope = branchScope;
