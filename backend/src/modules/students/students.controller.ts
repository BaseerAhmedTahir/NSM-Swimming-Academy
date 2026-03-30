import { Request, Response, NextFunction } from 'express';
import * as studentsService from './students.service';
import { successResponse } from '../../utils/response';

const getBranchId = (req: Request) => {
    return req.scopedBranchId || undefined;
};

export const searchStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = (req.query.q as string) || '';
        const branchId = getBranchId(req);
        const students = await studentsService.searchStudents(query, branchId);
        return successResponse({ res, data: students });
    } catch (error) {
        next(error);
    }
};

export const getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = getBranchId(req);
        const result = await studentsService.getAllStudents(req.query, branchId);
        return successResponse({ res, data: result.data, meta: result.meta });
    } catch (error) {
        next(error);
    }
};

export const getStudentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = getBranchId(req);
        const student = await studentsService.getStudentById(req.params.id as string, branchId);
        return successResponse({ res, data: student });
    } catch (error) {
        next(error);
    }
};

export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // scopedBranchId is set by branchScope middleware.
        // For STAFF it is locked to their branch (ignores any body.branchId).
        // For SUPER_ADMIN it comes from the request body or query.
        const adminBranchId = req.scopedBranchId || req.body.branchId || req.user!.branchId!;
        const student = await studentsService.createStudent(req.body, adminBranchId);
        return successResponse({ res, data: student, statusCode: 201, message: 'Student created and activated successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = getBranchId(req);
        const student = await studentsService.updateStudent(req.params.id as string, branchId, req.body);
        return successResponse({ res, data: student, message: 'Student updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = getBranchId(req);
        await studentsService.deleteStudent(req.params.id as string, branchId);
        return successResponse({ res, message: 'Student record deleted permanently' });
    } catch (error) {
        next(error);
    }
};

export const cancelStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = getBranchId(req);
        await studentsService.cancelStudent(req.params.id as string, branchId);
        return successResponse({ res, message: 'Membership cancelled successfully' });
    } catch (error) {
        next(error);
    }
};

export const activateStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = getBranchId(req);
        const student = await studentsService.activateStudent(req.params.id as string, branchId, req.body);
        return successResponse({ res, data: student, message: 'Student activated successfully' });
    } catch (error) {
        next(error);
    }
};

export const renewStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = getBranchId(req);
        const student = await studentsService.renewStudent(req.params.id as string, branchId, req.body);
        return successResponse({ res, data: student, message: 'Student renewed successfully. New invoice generated.' });
    } catch (error) {
        next(error);
    }
};

export const getStudentPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = getBranchId(req);
        const isStaff = req.user?.role === 'STAFF'; // STAFF can't see prices in some businesses, passing flag to format
        const payments = await studentsService.getStudentPayments(req.params.id as string, branchId, isStaff);
        return successResponse({ res, data: payments });
    } catch (error) {
        next(error);
    }
};

export const getStudentAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = getBranchId(req);
        const attendance = await studentsService.getStudentAttendance(req.params.id as string, branchId);
        return successResponse({ res, data: attendance });
    } catch (error) {
        next(error);
    }
};

export const getStudentMembershipHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = getBranchId(req);
        const history = await studentsService.getStudentMembershipHistory(req.params.id as string, branchId);
        return successResponse({ res, data: history });
    } catch (error) {
        next(error);
    }
};

export const getExpiredHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = getBranchId(req);
        const history = await studentsService.getExpiredHistory(branchId);
        return successResponse({ res, data: history });
    } catch (error) {
        next(error);
    }
};
