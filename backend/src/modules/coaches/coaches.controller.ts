import { Request, Response, NextFunction } from 'express';
import * as coachesService from './coaches.service';
import { successResponse } from '../../utils/response';

export const getAllCoaches = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const result = await coachesService.getAllCoaches(branchId, req.query);
        return successResponse({ res, data: result.data, meta: result.meta });
    } catch (error) {
        next(error);
    }
};

export const getCoachById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const coach = await coachesService.getCoachById(req.params.id as string, branchId);
        return successResponse({ res, data: coach });
    } catch (error) {
        next(error);
    }
};

export const createCoach = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminBranchId = req.scopedBranchId || req.user!.branchId!;
        const coach = await coachesService.createCoach(req.body, adminBranchId);
        return successResponse({ res, data: coach, statusCode: 201, message: 'Coach created successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateCoach = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const coach = await coachesService.updateCoach(req.params.id as string, branchId, req.body);
        return successResponse({ res, data: coach, message: 'Coach updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const deleteCoach = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        await coachesService.deleteCoach(req.params.id as string, branchId);
        return successResponse({ res, message: 'Coach deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const assignStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        await coachesService.assignStudents(req.params.id as string, branchId, req.body.studentIds);
        return successResponse({ res, message: 'Students assigned successfully' });
    } catch (error) {
        next(error);
    }
};

export const unassignStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        await coachesService.unassignStudent(req.params.id as string, req.params.studentId as string, branchId);
        return successResponse({ res, message: 'Student unassigned successfully' });
    } catch (error) {
        next(error);
    }
};
