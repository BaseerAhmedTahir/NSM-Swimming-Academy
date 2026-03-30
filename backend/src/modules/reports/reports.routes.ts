import { Router } from 'express';
import * as reportsController from './reports.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { branchScope } from '../../middleware/branchScope';
import { validate } from '../../middleware/validate';
import { getReportsSchema } from './reports.schema';

const router = Router();

router.use(authenticate);
router.use(authorize(['SUPER_ADMIN'])); // Reports are highly sensitive, restricted to top level
router.use(branchScope); // Still branch scope them in case Super Admin filters by branch

router.get('/:type', validate(getReportsSchema), reportsController.getReport);

export default router;
