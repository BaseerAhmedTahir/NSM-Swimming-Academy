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
exports.updateAttendance = exports.markAttendance = exports.getAttendanceByDate = void 0;
const attendanceService = __importStar(require("./attendance.service"));
const response_1 = require("../../utils/response");
const getAttendanceByDate = async (req, res, next) => {
    try {
        const branchId = req.query.branchId;
        const dateStr = req.query.date || new Date().toISOString().split('T')[0];
        const records = await attendanceService.getAttendanceByDate(dateStr, branchId);
        return (0, response_1.successResponse)({ res, data: records });
    }
    catch (error) {
        next(error);
    }
};
exports.getAttendanceByDate = getAttendanceByDate;
const markAttendance = async (req, res, next) => {
    try {
        const branchId = req.query.branchId;
        const markedBy = req.user.id;
        const record = await attendanceService.markAttendance(req.body, branchId, markedBy);
        return (0, response_1.successResponse)({ res, data: record, statusCode: 201, message: 'Attendance marked successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.markAttendance = markAttendance;
const updateAttendance = async (req, res, next) => {
    try {
        const branchId = req.query.branchId;
        const updatedBy = req.user.id;
        const record = await attendanceService.updateAttendance(req.params.id, branchId, req.body, updatedBy);
        return (0, response_1.successResponse)({ res, data: record, message: 'Attendance updated successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.updateAttendance = updateAttendance;
