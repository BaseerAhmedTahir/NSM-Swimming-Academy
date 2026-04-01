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
exports.markNotificationRead = exports.cancelClass = exports.getNotifications = exports.getPayments = exports.getAttendance = exports.getSchedule = exports.getProfile = void 0;
const studentAppService = __importStar(require("./student-app.service"));
const response_1 = require("../../utils/response");
const database_1 = require("../../config/database");
const getProfile = async (req, res, next) => {
    try {
        const data = await studentAppService.getProfile(req.user.id);
        return (0, response_1.successResponse)({ res, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
const getSchedule = async (req, res, next) => {
    try {
        const data = await studentAppService.getSchedule(req.user.id);
        return (0, response_1.successResponse)({ res, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getSchedule = getSchedule;
const getAttendance = async (req, res, next) => {
    try {
        const data = await studentAppService.getAttendance(req.user.id);
        return (0, response_1.successResponse)({ res, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getAttendance = getAttendance;
const getPayments = async (req, res, next) => {
    try {
        const data = await studentAppService.getPayments(req.user.id);
        return (0, response_1.successResponse)({ res, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getPayments = getPayments;
const getNotifications = async (req, res, next) => {
    try {
        const data = await studentAppService.getNotifications(req.user.id, req.user.branchId);
        return (0, response_1.successResponse)({ res, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getNotifications = getNotifications;
const cancelClass = async (req, res, next) => {
    try {
        // Frontend sends 'scheduleId' which maps to scheduleSlot.id
        const data = await studentAppService.cancelClass(req.user.id, req.body.scheduleId);
        return (0, response_1.successResponse)({ res, data, message: data.message });
    }
    catch (error) {
        next(error);
    }
};
exports.cancelClass = cancelClass;
const markNotificationRead = async (req, res, next) => {
    try {
        const notificationId = String(req.params.id);
        const studentId = String(req.user.id);
        await database_1.prisma.studentNotification.updateMany({
            where: { notificationId, studentId },
            data: { isRead: true, readAt: new Date() }
        });
        return (0, response_1.successResponse)({ res, data: null, message: 'Marked as read' });
    }
    catch (error) {
        next(error);
    }
};
exports.markNotificationRead = markNotificationRead;
