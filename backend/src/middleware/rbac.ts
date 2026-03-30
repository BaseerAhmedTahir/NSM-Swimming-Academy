import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';
import { ROLES_PERMISSIONS } from '../utils/constants';

/**
 * Checks if the authenticated user has ANY of the required permissions.
 * Alternatively, if passing a raw Role (like 'SUPER_ADMIN'), validates directly.
 */
export const authorize = (requiredPermissionsOrRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError('Authentication required to access this resource');
            }

            const userRole = req.user.role as keyof typeof ROLES_PERMISSIONS;
            
            // Check if exact role matches (e.g. ['SUPER_ADMIN', 'STAFF'])
            if (requiredPermissionsOrRoles.includes(userRole)) {
                return next();
            }

            // Check if user has required permissions for their role
            const userPermissions = ROLES_PERMISSIONS[userRole] || [];
            
            const hasPermission = requiredPermissionsOrRoles.some(permission => 
                userPermissions.includes(permission) || userPermissions.includes(`${permission.split(':')[0]}:full`)
            );

            if (!hasPermission) {
                throw new ForbiddenError(`You do not have permission to perform this action. Required: ${requiredPermissionsOrRoles.join(', ')}`);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
