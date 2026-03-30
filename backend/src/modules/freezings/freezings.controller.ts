import { Request, Response, NextFunction } from 'express';
import * as freezingsService from './freezings.service';
import { successResponse } from '../../utils/response';

export const getFreezings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const result = await freezingsService.getFreezings(branchId, req.query);
        return successResponse({ res, data: result.data, meta: result.meta });
    } catch (error) {
        next(error);
    }
};

export const getFreezingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const record = await freezingsService.getFreezingById(req.params.id as string, branchId);
        return successResponse({ res, data: record });
    } catch (error) {
        next(error);
    }
};

export const createFreezing = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const adminId = req.user!.id;
        const record = await freezingsService.createFreezing({ ...req.body, frozenBy: adminId }, branchId);
        return successResponse({ res, data: record, statusCode: 201, message: 'Account frozen successfully' });
    } catch (error) {
        next(error);
    }
};

export const unfreeze = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        await freezingsService.unfreeze(req.params.id as string, branchId, req.body);
        return successResponse({ res, message: 'Account unfrozen successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateFreezing = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const record = await freezingsService.updateFreezing(req.params.id as string, branchId, req.body);
        return successResponse({ res, data: record, message: 'Freezing record updated successfully' });
    } catch (error) {
        next(error);
    }
};
