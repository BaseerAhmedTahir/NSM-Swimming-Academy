import { Request, Response, NextFunction } from 'express';
import * as paymentsService from './payments.service';
import { successResponse } from '../../utils/response';

export const getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const result = await paymentsService.getAllPayments(req.query, branchId);
        return successResponse({ res, data: result.data, meta: result.meta });
    } catch (error) {
        next(error);
    }
};

export const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const payment = await paymentsService.getPaymentById(req.params.id as string, branchId);
        return successResponse({ res, data: payment });
    } catch (error) {
        next(error);
    }
};

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminBranchId = req.scopedBranchId || req.user!.branchId!;
        const payment = await paymentsService.createPayment(req.body, adminBranchId);
        return successResponse({ res, data: payment, statusCode: 201, message: 'Payment created successfully' });
    } catch (error) {
        next(error);
    }
};

export const updatePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const payment = await paymentsService.updatePayment(req.params.id as string, branchId, req.body);
        return successResponse({ res, data: payment, message: 'Payment updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const getPaymentStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const stats = await paymentsService.getPaymentStats(branchId);
        return successResponse({ res, data: stats });
    } catch (error) {
        next(error);
    }
};

export const createInstallment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const installment = await paymentsService.createInstallment(req.body, branchId);
        return successResponse({ res, data: installment, statusCode: 201, message: 'Installment created successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateInstallment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const installment = await paymentsService.updateInstallment(req.params.id as string, branchId, req.body);
        return successResponse({ res, data: installment, message: 'Installment updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const receivePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const payment = await paymentsService.receivePayment(req.params.id as string, branchId, req.body);
        return successResponse({ res, data: payment, message: 'Payment received successfully' });
    } catch (error) {
        next(error);
    }
};

export const getStudentPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.scopedBranchId;
        const history = await paymentsService.getStudentPaymentHistory(req.params.studentId as string, branchId);
        return successResponse({ res, data: history });
    } catch (error) {
        next(error);
    }
};
