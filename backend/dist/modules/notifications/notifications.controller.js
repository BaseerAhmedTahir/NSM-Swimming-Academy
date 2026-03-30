"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.createNotification = exports.getNotifications = exports.streamNotifications = void 0;
const notificationsService = __importStar(require("./notifications.service"));
const response_1 = require("../../utils/response");
const sse_1 = require("../../utils/sse");
const streamNotifications = (req, res) => {
    // SSE Setup
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client
    // Tell the client we started
    res.write('data: {"message": "Connected to NSM SSE"}\n\n');
    // Register this client connection
    const clientId = req.user.id;
    const branchId = req.user.branchId || undefined;
    const role = req.user.role;
    // Establish connection and heartbeat
    (0, sse_1.addClient)(req, res, clientId, branchId, role);
};
exports.streamNotifications = streamNotifications;
const getNotifications = async (req, res, next) => {
    try {
        const branchId = req.query.branchId || req.user.branchId || undefined;
        let targetId = req.user.role === 'STUDENT' ? req.user.id : undefined;
        const result = await notificationsService.getNotifications(req.user.id, targetId, branchId, req.query);
        return (0, response_1.successResponse)({ res, data: result.data, meta: result.meta });
    }
    catch (error) {
        next(error);
    }
};
exports.getNotifications = getNotifications;
const createNotification = async (req, res, next) => {
    try {
        const adminBranchId = req.user.branchId || undefined;
        const notification = await notificationsService.createNotification(req.body, adminBranchId);
        return (0, response_1.successResponse)({ res, data: notification, statusCode: 201, message: 'Notification sent successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.createNotification = createNotification;
const markAsRead = async (req, res, next) => {
    try {
        await notificationsService.markNotificationsRead(req.body.notificationIds, req.user.id);
        return (0, response_1.successResponse)({ res, message: 'Notifications marked as read' });
    }
    catch (error) {
        next(error);
    }
};
exports.markAsRead = markAsRead;
