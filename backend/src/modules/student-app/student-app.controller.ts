import { Request, Response, NextFunction } from 'express';
import * as studentAppService from './student-app.service';
import { successResponse } from '../../utils/response';
import { prisma } from '../../config/database';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await studentAppService.getProfile(req.user!.id);
        return successResponse({ res, data });
    } catch (error) { next(error); }
};

export const getSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await studentAppService.getSchedule(req.user!.id);
        return successResponse({ res, data });
    } catch (error) { next(error); }
};

export const getAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await studentAppService.getAttendance(req.user!.id);
        return successResponse({ res, data });
    } catch (error) { next(error); }
};

export const getPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await studentAppService.getPayments(req.user!.id);
        return successResponse({ res, data });
    } catch (error) { next(error); }
};

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await studentAppService.getNotifications(req.user!.id, req.user!.branchId!);
        return successResponse({ res, data });
    } catch (error) { next(error); }
};

export const cancelClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Frontend sends 'scheduleId' which maps to scheduleSlot.id
        const data = await studentAppService.cancelClass(req.user!.id, req.body.scheduleId);
        return successResponse({ res, data, message: data.message });
    } catch (error) { next(error); }
};

export const markNotificationRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notificationId: string = String(req.params.id);
        const studentId: string = String(req.user!.id);
        await prisma.studentNotification.updateMany({
            where: { notificationId, studentId },
            data: { isRead: true, readAt: new Date() }
        });
        return successResponse({ res, data: null, message: 'Marked as read' });
    } catch (error) { next(error); }
};

export const submitReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const studentId: string = String(req.user!.id);
        const branchId: string | undefined = req.user!.branchId ? String(req.user!.branchId) : undefined;
        const data = await studentAppService.submitReview(studentId, branchId, req.body);
        return successResponse({ res, data, statusCode: 201, message: 'Review submitted successfully' });
    } catch (error) { next(error); }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const studentId: string = String(req.user!.id);
        const data = await studentAppService.deleteReview(studentId);
        return successResponse({ res, data, message: 'Review deleted successfully' });
    } catch (error) { next(error); }
};

