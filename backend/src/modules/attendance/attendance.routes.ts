import { Router } from 'express';
import * as attendanceController from './attendance.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { branchScope } from '../../middleware/branchScope';
import { validate } from '../../middleware/validate';
import { getAttendanceSchema, markAttendanceSchema, updateAttendanceSchema } from './attendance.schema';

const router = Router();

router.use(authenticate);
router.use(authorize(['SUPER_ADMIN', 'STAFF']));
router.use(branchScope);

router.get('/', validate(getAttendanceSchema), attendanceController.getAttendanceByDate);
router.post('/', validate(markAttendanceSchema), attendanceController.markAttendance);
router.put('/:id', validate(updateAttendanceSchema), attendanceController.updateAttendance);

export default router;
