import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { successResponse } from '../../utils/response';

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.adminLogin(req.body);
        return successResponse({ res, data: result, message: 'Admin login successful' });
    } catch (error) {
        next(error);
    }
};

export const studentRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.studentRegister(req.body);
        return successResponse({ 
            res, 
            data: result, 
            message: 'Registration successful. Please wait for admin approval.',
            statusCode: 201 
        });
    } catch (error) {
        next(error);
    }
};

export const studentLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.studentLogin(req.body);
        return successResponse({ res, data: result, message: 'Student login successful' });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshToken(refreshToken);
        return successResponse({ res, data: result, message: 'Token refreshed successfully' });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        await authService.logout(refreshToken);
        return successResponse({ res, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authService.forgotPassword(req.body.email);
        return successResponse({ res, message: 'If an account exists, a password reset link has been sent.' });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authService.resetPassword(req.body);
        return successResponse({ res, message: 'Password has been reset successfully. You can now login.' });
    } catch (error) {
        next(error);
    }
};
