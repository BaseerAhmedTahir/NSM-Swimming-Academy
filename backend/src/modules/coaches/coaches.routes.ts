import { Router } from 'express';
import * as coachesController from './coaches.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { branchScope } from '../../middleware/branchScope';
import { createCoachSchema, updateCoachSchema, assignStudentsSchema } from './coaches.schema';

const router = Router();

// Apply auth and branch scoping to all routes here
router.use(authenticate);
router.use(authorize(['SUPER_ADMIN', 'STAFF', 'coaches:full']));
router.use(branchScope);

router.get('/', coachesController.getAllCoaches);
router.get('/:id', coachesController.getCoachById);
router.post('/', validate(createCoachSchema), coachesController.createCoach);
router.put('/:id', validate(updateCoachSchema), coachesController.updateCoach);
router.delete('/:id', coachesController.deleteCoach);

router.post('/:id/assign-students', validate(assignStudentsSchema), coachesController.assignStudents);
router.delete('/:id/unassign-student/:studentId', coachesController.unassignStudent);

export default router;
