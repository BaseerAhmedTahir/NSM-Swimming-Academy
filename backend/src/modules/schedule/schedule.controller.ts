import { Request, Response, NextFunction } from 'express';
import * as scheduleService from './schedule.service';
import { successResponse } from '../../utils/response';

export const getScheduleGrid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId || req.query.branchId as string;
        const dateStr = req.query.date as string;

        if (!branchId) throw new Error('Branch ID is required');

        const grid = await scheduleService.getScheduleGrid(dateStr, branchId);
        return successResponse({ res, data: grid });
    } catch (error) {
        next(error);
    }
};

export const assignSlot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId || req.query.branchId as string;
        await scheduleService.assignSlot(req.body, branchId);
        return successResponse({ res, message: 'Slot assigned successfully' });
    } catch (error) {
        next(error);
    }
};

export const removeSlot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId || req.query.branchId as string;
        await scheduleService.removeSlot(req.body, branchId);
        return successResponse({ res, message: 'Slot cleared successfully' });
    } catch (error) {
        next(error);
    }
};

export const swapSlot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId || req.query.branchId as string;
        await scheduleService.swapSlot(req.body, branchId);
        return successResponse({ res, message: 'Slots swapped successfully' });
    } catch (error) {
        next(error);
    }
};
