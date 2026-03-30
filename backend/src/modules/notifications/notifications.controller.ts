import { Request, Response, NextFunction } from 'express';
import * as notificationsService from './notifications.service';
import { successResponse } from '../../utils/response';
import { addClient } from '../../utils/sse';

export const streamNotifications = (req: Request, res: Response) => {
    // SSE Setup
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    // Tell the client we started
    res.write('data: {"message": "Connected to NSM SSE"}\n\n');

    // Register this client connection
    const clientId = req.user!.id;
    const branchId = req.user!.branchId || undefined;
    const role = req.user!.role;

    // Establish connection and heartbeat
    addClient(req, res, clientId, branchId, role);
};

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const branchId = (req.query.branchId as string) || req.user!.branchId || undefined;
        let targetId = req.user!.role === 'STUDENT' ? req.user!.id : undefined;

        const result = await notificationsService.getNotifications(req.user!.id, targetId, branchId, req.query);
        return successResponse({ res, data: result.data, meta: result.meta });
    } catch (error) {
        next(error);
    }
};

export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminBranchId = req.user!.branchId || undefined;
        const notification = await notificationsService.createNotification(req.body, adminBranchId);
        return successResponse({ res, data: notification, statusCode: 201, message: 'Notification sent successfully' });
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await notificationsService.markNotificationsRead(req.body.notificationIds, req.user!.id);
        return successResponse({ res, message: 'Notifications marked as read' });
    } catch (error) {
        next(error);
    }
};
