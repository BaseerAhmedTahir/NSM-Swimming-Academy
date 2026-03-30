import { Request, Response, NextFunction } from 'express';
import * as branchesService from './branches.service';
import { successResponse } from '../../utils/response';

export const getAllBranches = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branches = await branchesService.getAllBranches();
        return successResponse({ res, data: branches });
    } catch (error) {
        next(error);
    }
};

export const getBranchById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branch = await branchesService.getBranchById(req.params.id as string);
        return successResponse({ res, data: branch });
    } catch (error) {
        next(error);
    }
};

export const createBranch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branch = await branchesService.createBranch(req.body);
        return successResponse({ res, data: branch, message: 'Branch created successfully', statusCode: 201 });
    } catch (error) {
        next(error);
    }
};

export const updateBranch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branch = await branchesService.updateBranch(req.params.id as string, req.body);
        return successResponse({ res, data: branch, message: 'Branch updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const upsertBranchAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admin = await branchesService.upsertBranchAdmin(req.params.id as string, req.body);
        return successResponse({ res, data: { id: admin.id, username: admin.username, email: admin.email }, message: 'Branch Admin credentials saved successfully' });
    } catch (error) {
        next(error);
    }
};

export const deleteBranch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await branchesService.deleteBranch(req.params.id as string);
        return successResponse({ res, message: 'Branch deactivated successfully' });
    } catch (error) {
        next(error);
    }
};
