"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const errors_1 = require("../utils/errors");
const constants_1 = require("../utils/constants");
/**
 * Checks if the authenticated user has ANY of the required permissions.
 * Alternatively, if passing a raw Role (like 'SUPER_ADMIN'), validates directly.
 */
const authorize = (requiredPermissionsOrRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new errors_1.UnauthorizedError('Authentication required to access this resource');
            }
            const userRole = req.user.role;
            // Check if exact role matches (e.g. ['SUPER_ADMIN', 'STAFF'])
            if (requiredPermissionsOrRoles.includes(userRole)) {
                return next();
            }
            // Check if user has required permissions for their role
            const userPermissions = constants_1.ROLES_PERMISSIONS[userRole] || [];
            const hasPermission = requiredPermissionsOrRoles.some(permission => userPermissions.includes(permission) || userPermissions.includes(`${permission.split(':')[0]}:full`));
            if (!hasPermission) {
                throw new errors_1.ForbiddenError(`You do not have permission to perform this action. Required: ${requiredPermissionsOrRoles.join(', ')}`);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authorize = authorize;
