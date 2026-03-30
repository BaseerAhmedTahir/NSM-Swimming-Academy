import { Router } from 'express';
import * as remindersController from './reminders.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { branchScope } from '../../middleware/branchScope';
import { validate } from '../../middleware/validate';
import { createReminderSchema, updateReminderSchema, snoozeReminderSchema } from './reminders.schema';

const router = Router();

router.use(authenticate);
router.use(authorize(['SUPER_ADMIN', 'STAFF']));
router.use(branchScope);

router.get('/', remindersController.getReminders);
router.post('/', validate(createReminderSchema), remindersController.createReminder);
router.put('/:id', validate(updateReminderSchema), remindersController.updateReminder);
router.post('/:id/snooze', validate(snoozeReminderSchema), remindersController.snoozeReminder);
router.delete('/:id', remindersController.deleteReminder);

export default router;
