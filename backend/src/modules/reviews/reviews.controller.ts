import { Request, Response, NextFunction } from 'express';
import * as reviewsService from './reviews.service';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.user?.role === 'STAFF' ? req.user.branchId : undefined;
        const data = await reviewsService.getAllReviews(req.query, branchId);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = req.user?.role === 'STAFF' ? req.user.branchId : (req.query.branchId as string | undefined);
        const data = await reviewsService.getReviewStats(branchId);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

export const submitReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const studentId = req.user?.id;
        const branchId  = req.user?.branchId;
        if (!studentId) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const review = await reviewsService.createReview(studentId, branchId, req.body);
        res.status(201).json({ success: true, data: review });
    } catch (err) { next(err); }
};
