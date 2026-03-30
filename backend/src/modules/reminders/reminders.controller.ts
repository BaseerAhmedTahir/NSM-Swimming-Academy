import { Request, Response, NextFunction } from 'express';
import * as remindersService from './reminders.service';
import { successResponse } from '../../utils/response';

export const getReminders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const result = await remindersService.getReminders(branchId, req.query);
        return successResponse({ res, data: result.data, meta: result.meta });
    } catch (error) {
        next(error);
    }
};

export const createReminder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId || req.user!.branchId;
        const reminder = await remindersService.createReminder(req.body, branchId, req.user!.id);
        return successResponse({ res, data: reminder, statusCode: 201, message: 'Reminder created successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateReminder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const reminder = await remindersService.updateReminder(req.params.id as string, branchId, req.body);
        return successResponse({ res, data: reminder, message: 'Reminder updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const snoozeReminder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const reminder = await remindersService.snoozeReminder(req.params.id as string, branchId, req.body.snoozeUntil);
        return successResponse({ res, data: reminder, message: 'Reminder snoozed' });
    } catch (error) {
        next(error);
    }
};

export const deleteReminder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        await remindersService.deleteReminder(req.params.id as string, branchId);
        return successResponse({ res, message: 'Reminder deleted' });
    } catch (error) {
        next(error);
    }
};
