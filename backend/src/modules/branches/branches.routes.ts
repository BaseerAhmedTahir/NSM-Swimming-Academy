import { Router } from 'express';
import * as branchesController from './branches.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { createBranchSchema, updateBranchSchema, branchAdminSchema } from './branches.schema';

const router = Router();

// Public route for login page dropping
router.get('/', branchesController.getAllBranches);

// Protected routes
router.post('/', authenticate, authorize(['SUPER_ADMIN']), validate(createBranchSchema), branchesController.createBranch);
router.get('/:id', authenticate, branchesController.getBranchById);
router.put('/:id', authenticate, authorize(['SUPER_ADMIN']), validate(updateBranchSchema), branchesController.updateBranch);
router.post('/:id/admin', authenticate, authorize(['SUPER_ADMIN']), validate(branchAdminSchema), branchesController.upsertBranchAdmin);
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN']), branchesController.deleteBranch);

export default router;
