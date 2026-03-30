import { Request, Response, NextFunction } from 'express';
import * as reportsService from './reports.service';
import { successResponse } from '../../utils/response';

export const getReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const type = req.params.type as string; // e.g. 'revenue', 'attendance', 'students'
        const format = (req.query.format as string) || 'JSON';
        
        // Merge scopedBranchId into queryArgs so the service correctly scopes data
        const queryArgs = { ...req.query };
        if (req.scopedBranchId) {
            queryArgs.branchId = req.scopedBranchId;
        }
        
        const data = await reportsService.generateReportData(type, queryArgs);

        if (format === 'PDF') {
            const doc = await reportsService.createPdfReportStream(type, data);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${type}_report.pdf"`);
            doc.pipe(res);
            doc.end();
            return;
        } else if (format === 'EXCEL') {
            const workbook = await reportsService.createExcelReport(type, data);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${type}_report.xlsx"`);
            await workbook.xlsx.write(res);
            res.end();
            return;
        }

        return successResponse({ res, data });
    } catch (error) {
        next(error);
    }
};
