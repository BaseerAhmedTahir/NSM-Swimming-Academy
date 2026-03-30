import { Request, Response, NextFunction } from 'express';
import * as invoicesService from './invoices.service';
import { successResponse } from '../../utils/response';

export const getInvoiceData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.query.branchId as string;
        const data = await invoicesService.getInvoiceData(req.params.id as string, branchId);
        return successResponse({ res, data });
    } catch (error) {
        next(error);
    }
};

export const downloadInvoicePdf = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.query.branchId as string;
        const { doc, filename } = await invoicesService.createInvoicePdfStream(req.params.id as string, branchId);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        doc.pipe(res);
        doc.end();
    } catch (error) {
        next(error);
    }
};

export const previewInvoicePdf = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.query.branchId as string;
        const { doc } = await invoicesService.createInvoicePdfStream(req.params.id as string, branchId);

        res.setHeader('Content-Type', 'application/pdf');
        // inline disposition so browser shows it instead of downloading
        res.setHeader('Content-Disposition', 'inline');

        doc.pipe(res);
        doc.end();
    } catch (error) {
        next(error);
    }
};
