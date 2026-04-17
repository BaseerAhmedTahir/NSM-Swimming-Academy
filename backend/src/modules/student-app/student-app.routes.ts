import { Router } from 'express';
import * as studentAppController from './student-app.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { cancelClassSchema } from './student-app.schema';
import { createReviewSchema } from '../reviews/reviews.schema';

const router = Router();

// Only authenticated students
router.use(authenticate);
router.use(authorize(['STUDENT']));

router.get('/profile', studentAppController.getProfile);
router.get('/schedule', studentAppController.getSchedule);
router.get('/attendance', studentAppController.getAttendance);
router.get('/payments', studentAppController.getPayments);
router.get('/notifications', studentAppController.getNotifications);
router.post('/notifications/:id/read', studentAppController.markNotificationRead);
router.post('/cancel-class', validate(cancelClassSchema), studentAppController.cancelClass);
router.post('/review', validate(createReviewSchema), studentAppController.submitReview);
router.delete('/review', studentAppController.deleteReview);

export default router;

