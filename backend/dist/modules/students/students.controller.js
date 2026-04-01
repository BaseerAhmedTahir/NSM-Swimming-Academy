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
exports.getExpiredHistory = exports.getStudentMembershipHistory = exports.getStudentAttendance = exports.getStudentPayments = exports.renewStudent = exports.activateStudent = exports.cancelStudent = exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.getStudentById = exports.getAllStudents = exports.searchStudents = void 0;
const studentsService = __importStar(require("./students.service"));
const response_1 = require("../../utils/response");
const getBranchId = (req) => {
    return req.scopedBranchId || undefined;
};
const searchStudents = async (req, res, next) => {
    try {
        const query = req.query.q || '';
        const branchId = getBranchId(req);
        const students = await studentsService.searchStudents(query, branchId);
        return (0, response_1.successResponse)({ res, data: students });
    }
    catch (error) {
        next(error);
    }
};
exports.searchStudents = searchStudents;
const getAllStudents = async (req, res, next) => {
    try {
        const branchId = getBranchId(req);
        const result = await studentsService.getAllStudents(req.query, branchId);
        return (0, response_1.successResponse)({ res, data: result.data, meta: result.meta });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllStudents = getAllStudents;
const getStudentById = async (req, res, next) => {
    try {
        const branchId = getBranchId(req);
        const student = await studentsService.getStudentById(req.params.id, branchId);
        return (0, response_1.successResponse)({ res, data: student });
    }
    catch (error) {
        next(error);
    }
};
exports.getStudentById = getStudentById;
const createStudent = async (req, res, next) => {
    try {
        // scopedBranchId is set by branchScope middleware.
        // For STAFF it is locked to their branch (ignores any body.branchId).
        // For SUPER_ADMIN it comes from the request body or query.
        const adminBranchId = req.scopedBranchId || req.body.branchId || req.user.branchId;
        const student = await studentsService.createStudent(req.body, adminBranchId);
        return (0, response_1.successResponse)({ res, data: student, statusCode: 201, message: 'Student created and activated successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.createStudent = createStudent;
const updateStudent = async (req, res, next) => {
    try {
        const branchId = getBranchId(req);
        const student = await studentsService.updateStudent(req.params.id, branchId, req.body);
        return (0, response_1.successResponse)({ res, data: student, message: 'Student updated successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.updateStudent = updateStudent;
const deleteStudent = async (req, res, next) => {
    try {
        const branchId = getBranchId(req);
        await studentsService.deleteStudent(req.params.id, branchId);
        return (0, response_1.successResponse)({ res, message: 'Student record deleted permanently' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteStudent = deleteStudent;
const cancelStudent = async (req, res, next) => {
    try {
        const branchId = getBranchId(req);
        await studentsService.cancelStudent(req.params.id, branchId);
        return (0, response_1.successResponse)({ res, message: 'Membership cancelled successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.cancelStudent = cancelStudent;
const activateStudent = async (req, res, next) => {
    try {
        const branchId = getBranchId(req);
        const student = await studentsService.activateStudent(req.params.id, branchId, req.body);
        return (0, response_1.successResponse)({ res, data: student, message: 'Student activated successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.activateStudent = activateStudent;
const renewStudent = async (req, res, next) => {
    try {
        const branchId = getBranchId(req);
        const student = await studentsService.renewStudent(req.params.id, branchId, req.body);
        return (0, response_1.successResponse)({ res, data: student, message: 'Student renewed successfully. New invoice generated.' });
    }
    catch (error) {
        next(error);
    }
};
exports.renewStudent = renewStudent;
const getStudentPayments = async (req, res, next) => {
    try {
        const branchId = getBranchId(req);
        const isStaff = req.user?.role === 'STAFF'; // STAFF can't see prices in some businesses, passing flag to format
        const payments = await studentsService.getStudentPayments(req.params.id, branchId, isStaff);
        return (0, response_1.successResponse)({ res, data: payments });
    }
    catch (error) {
        next(error);
    }
};
exports.getStudentPayments = getStudentPayments;
const getStudentAttendance = async (req, res, next) => {
    try {
        const branchId = getBranchId(req);
        const attendance = await studentsService.getStudentAttendance(req.params.id, branchId);
        return (0, response_1.successResponse)({ res, data: attendance });
    }
    catch (error) {
        next(error);
    }
};
exports.getStudentAttendance = getStudentAttendance;
const getStudentMembershipHistory = async (req, res, next) => {
    try {
        const branchId = getBranchId(req);
        const history = await studentsService.getStudentMembershipHistory(req.params.id, branchId);
        return (0, response_1.successResponse)({ res, data: history });
    }
    catch (error) {
        next(error);
    }
};
exports.getStudentMembershipHistory = getStudentMembershipHistory;
const getExpiredHistory = async (req, res, next) => {
    try {
        const branchId = getBranchId(req);
        const history = await studentsService.getExpiredHistory(branchId);
        return (0, response_1.successResponse)({ res, data: history });
    }
    catch (error) {
        next(error);
    }
};
exports.getExpiredHistory = getExpiredHistory;
