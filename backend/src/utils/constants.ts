export const ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    STAFF: 'STAFF',
};

export const STUDENT_STATUS = {
    PENDING: 'PENDING',
    ACTIVE: 'ACTIVE',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
    FROZEN: 'FROZEN',
};

export const ROLES_PERMISSIONS = {
    SUPER_ADMIN: [
        'dashboard:full', 'schedule:full', 'registration:full',
        'coaches:full', 'payments:full', 'payments:view_revenue',
        'cancellations:full', 'notifications:full', 'reminders:full',
        'reports:full', 'settings:full'
    ],
    STAFF: [
        'dashboard:limited', 'schedule:full', 'registration:full',
        'coaches:full', 'payments:limited', 'cancellations:full',
        'notifications:full', 'reminders:full'
    ],
    STUDENT: [
        'profile:read', 'schedule:read', 'notifications:read',
        'cancel_class:own', 'fee_status:read', 'level:read'
    ]
};
