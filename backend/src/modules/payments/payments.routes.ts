import { Router } from 'express';
import * as paymentsController from './payments.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { branchScope } from '../../middleware/branchScope';
import { validate } from '../../middleware/validate';
import { createPaymentSchema, updatePaymentSchema, createInstallmentSchema, updateInstallmentSchema, receivePaymentSchema } from './payments.schema';

const router = Router();

router.use(authenticate);
router.use(authorize(['SUPER_ADMIN', 'STAFF'])); // Allow STAFF to handle payments as they manage registrations. 
router.use(branchScope);

router.get('/stats', paymentsController.getPaymentStats);
router.get('/', paymentsController.getAllPayments);
router.get('/:id', paymentsController.getPaymentById);
router.post('/', validate(createPaymentSchema), paymentsController.createPayment);
router.put('/:id', validate(updatePaymentSchema), paymentsController.updatePayment);

// Receive payment against existing payment record
router.post('/:id/receive', validate(receivePaymentSchema), paymentsController.receivePayment);

// Get full payment history for a student
router.get('/student/:studentId/history', paymentsController.getStudentPaymentHistory);

// Installments
router.post('/installments', validate(createInstallmentSchema), paymentsController.createInstallment);
router.put('/installments/:id', validate(updateInstallmentSchema), paymentsController.updateInstallment);

export default router;
