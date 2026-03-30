import { Router } from 'express';
import * as studentsController from './students.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { branchScope } from '../../middleware/branchScope';
import { validate } from '../../middleware/validate';
import { createStudentSchema, updateStudentSchema, activateStudentSchema, renewStudentSchema } from './students.schema';

const router = Router();

// Apply auth and branch scoping to all routes
router.use(authenticate);
router.use(authorize(['SUPER_ADMIN', 'STAFF', 'students:full'])); // Assuming staff and super_admin have full student access
router.use(branchScope);

// Search first so it doesn't collide with /:id
router.get('/search', studentsController.searchStudents);

// Global expired history (must be before /:id to avoid route collision)
router.get('/expired-history', studentsController.getExpiredHistory);

// CRUD
router.get('/', studentsController.getAllStudents);
router.get('/:id', studentsController.getStudentById);
router.post('/', validate(createStudentSchema), studentsController.createStudent);
router.put('/:id', validate(updateStudentSchema), studentsController.updateStudent);
router.delete('/:id', studentsController.deleteStudent);

// Actions
router.post('/:id/activate', validate(activateStudentSchema), studentsController.activateStudent);
router.post('/:id/renew', validate(renewStudentSchema), studentsController.renewStudent);
router.post('/:id/cancel', studentsController.cancelStudent);

// Sub-resources
router.get('/:id/payments', studentsController.getStudentPayments);
router.get('/:id/attendance', studentsController.getStudentAttendance);
router.get('/:id/membership-history', studentsController.getStudentMembershipHistory);

export default router;
