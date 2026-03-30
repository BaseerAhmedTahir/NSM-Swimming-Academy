import { Router } from 'express';
import { validate } from '../../middleware/validate';
import * as authController from './auth.controller';
import { adminLoginSchema, studentRegisterSchema, studentLoginSchema, refreshTokenSchema, resetPasswordSchema, forgotPasswordSchema } from './auth.schema';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/admin/login', validate(adminLoginSchema), authController.adminLogin);
router.post('/student/register', validate(studentRegisterSchema), authController.studentRegister);
router.post('/student/login', validate(studentLoginSchema), authController.studentLogin);

router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authenticate, validate(refreshTokenSchema), authController.logout); // Needs both valid access and refresh Token provided

router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

export default router;
