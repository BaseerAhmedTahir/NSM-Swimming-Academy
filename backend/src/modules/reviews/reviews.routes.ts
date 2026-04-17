import { Router } from 'express';
import * as reviewsController from './reviews.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { createReviewSchema } from './reviews.schema';

const router = Router();

// Admin routes — read reviews
router.get('/', authenticate, authorize(['SUPER_ADMIN', 'STAFF']), reviewsController.getAll);
router.get('/stats', authenticate, authorize(['SUPER_ADMIN', 'STAFF']), reviewsController.getStats);

// Student route — submit a review
router.post('/', authenticate, authorize(['STUDENT']), validate(createReviewSchema), reviewsController.submitReview);

export default router;
