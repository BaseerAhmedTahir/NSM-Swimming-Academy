import { Router } from 'express';
import * as cancellationsController from './cancellations.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { branchScope } from '../../middleware/branchScope';
import { validate } from '../../middleware/validate';
import { createCancellationSchema, updateCancellationSchema } from './cancellations.schema';

const router = Router();

router.use(authenticate);
router.use(authorize(['SUPER_ADMIN', 'STAFF'])); 
router.use(branchScope);

router.get('/', cancellationsController.getCancellations);
router.get('/:id', cancellationsController.getCancellationById);
router.post('/', validate(createCancellationSchema), cancellationsController.createCancellation);
router.put('/:id', validate(updateCancellationSchema), cancellationsController.updateCancellation);

export default router;
