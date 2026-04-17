import { Router } from 'express';
import * as expensesController from './expenses.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { createExpenseSchema, updateExpenseSchema } from './expenses.schema';

const router = Router();

router.use(authenticate);
router.use(authorize(['SUPER_ADMIN', 'STAFF']));

router.get('/',         expensesController.getAll);
router.get('/stats',    expensesController.getStats);
router.post('/',        validate(createExpenseSchema), expensesController.create);
router.put('/:id',      validate(updateExpenseSchema), expensesController.update);
router.delete('/:id',   expensesController.remove);

export default router;
