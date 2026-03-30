import { Request, Response, NextFunction } from 'express';
import * as cancellationsService from './cancellations.service';
import { successResponse } from '../../utils/response';

export const getCancellations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const result = await cancellationsService.getCancellations(branchId, req.query);
        return successResponse({ res, data: result.data, meta: result.meta });
    } catch (error) {
        next(error);
    }
};

export const getCancellationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const record = await cancellationsService.getCancellationById(req.params.id as string, branchId);
        return successResponse({ res, data: record });
    } catch (error) {
        next(error);
    }
};

export const createCancellation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const record = await cancellationsService.createCancellation(req.body, branchId);
        return successResponse({ res, data: record, statusCode: 201, message: 'Student membership cancelled successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateCancellation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const record = await cancellationsService.updateCancellation(req.params.id as string, branchId, req.body);
        return successResponse({ res, data: record, message: 'Cancellation record updated successfully' });
    } catch (error) {
        next(error);
    }
};
