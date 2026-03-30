import { Router } from 'express';
import * as notificationsController from './notifications.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { createNotificationSchema, markReadSchema } from './notifications.schema';

const router = Router();

router.use(authenticate);

// SSE stream for real-time notifications
router.get('/stream', notificationsController.streamNotifications);

// REST
router.get('/', notificationsController.getNotifications);
router.post('/mark-read', validate(markReadSchema), notificationsController.markAsRead);

// Admin only routes for creating custom notifications
router.post('/', authorize(['SUPER_ADMIN', 'STAFF']), validate(createNotificationSchema), notificationsController.createNotification);

export default router;
