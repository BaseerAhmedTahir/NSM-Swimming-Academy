import { Router } from 'express';
import * as freezingsController from './freezings.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { branchScope } from '../../middleware/branchScope';
import { validate } from '../../middleware/validate';
import { createFreezingSchema, updateFreezingSchema, unfreezeSchema } from './freezings.schema';

const router = Router();

router.use(authenticate);
router.use(authorize(['SUPER_ADMIN', 'STAFF'])); // Allow staff as they manage student statuses
router.use(branchScope);

router.get('/', freezingsController.getFreezings);
router.get('/:id', freezingsController.getFreezingById);
router.post('/', validate(createFreezingSchema), freezingsController.createFreezing);
router.put('/:id', validate(updateFreezingSchema), freezingsController.updateFreezing);
router.post('/:id/unfreeze', validate(unfreezeSchema), freezingsController.unfreeze);

export default router;
