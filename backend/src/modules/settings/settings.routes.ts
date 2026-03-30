import { Router } from 'express';
import * as settingsController from './settings.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { saveSettingsSchema } from './settings.schema';

const router = Router();

router.use(authenticate);

// Everyone authenticated can GET settings (used by frontend to get time-slots, packages, etc)
router.get('/', settingsController.getSettings);

// Only Super Admin can modify settings
router.post('/bulk', authorize(['SUPER_ADMIN']), validate(saveSettingsSchema), settingsController.saveSettings);

export default router;
