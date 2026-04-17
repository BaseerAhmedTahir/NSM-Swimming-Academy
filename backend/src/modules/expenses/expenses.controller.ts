import { Request, Response, NextFunction } from 'express';
import * as expensesService from './expenses.service';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.user?.role === 'STAFF' ? req.user.branchId : undefined;
        const data = await expensesService.getAllExpenses(req.query, branchId);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.user?.role === 'STAFF' ? req.user.branchId : undefined;
        const data = await expensesService.getExpenseStats(req.query, branchId);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;
        if (!adminId) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const data = await expensesService.createExpense(req.body, adminId);
        res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await expensesService.updateExpense(req.params.id as string, req.body);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await expensesService.deleteExpense(req.params.id as string);
        res.json({ success: true, message: 'Expense deleted successfully' });
    } catch (err) { next(err); }
};
