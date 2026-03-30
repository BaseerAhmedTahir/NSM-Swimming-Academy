import { Router } from 'express';
import * as scheduleController from './schedule.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { branchScope } from '../../middleware/branchScope';
import { validate } from '../../middleware/validate';
import { getGridSchema, assignSlotSchema, removeSlotSchema, swapSlotSchema } from './schedule.schema';

const router = Router();

router.use(authenticate);
router.use(authorize(['SUPER_ADMIN', 'STAFF', 'schedules:full']));
router.use(branchScope);

router.get('/grid', validate(getGridSchema), scheduleController.getScheduleGrid);
router.post('/assign', validate(assignSlotSchema), scheduleController.assignSlot);
router.post('/remove', validate(removeSlotSchema), scheduleController.removeSlot);
router.post('/swap', validate(swapSlotSchema), scheduleController.swapSlot);

export default router;
