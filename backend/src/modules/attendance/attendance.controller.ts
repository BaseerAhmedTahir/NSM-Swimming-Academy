import { Request, Response, NextFunction } from 'express';
import * as attendanceService from './attendance.service';
import { successResponse } from '../../utils/response';

export const getAttendanceByDate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const dateStr = req.query.date as string || new Date().toISOString().split('T')[0];
        const records = await attendanceService.getAttendanceByDate(dateStr, branchId);
        return successResponse({ res, data: records });
    } catch (error) {
        next(error);
    }
};

export const markAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const markedBy = req.user!.id;
        const record = await attendanceService.markAttendance(req.body, branchId, markedBy);
        return successResponse({ res, data: record, statusCode: 201, message: 'Attendance marked successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const updatedBy = req.user!.id;
        const record = await attendanceService.updateAttendance(req.params.id as string, branchId, req.body, updatedBy);
        return successResponse({ res, data: record, message: 'Attendance updated successfully' });
    } catch (error) {
        next(error);
    }
};
