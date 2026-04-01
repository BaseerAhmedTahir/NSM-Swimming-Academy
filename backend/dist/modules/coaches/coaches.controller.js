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
exports.unassignStudent = exports.assignStudents = exports.deleteCoach = exports.updateCoach = exports.createCoach = exports.getCoachById = exports.getAllCoaches = void 0;
const coachesService = __importStar(require("./coaches.service"));
const response_1 = require("../../utils/response");
const getAllCoaches = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId;
        const result = await coachesService.getAllCoaches(branchId, req.query);
        return (0, response_1.successResponse)({ res, data: result.data, meta: result.meta });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllCoaches = getAllCoaches;
const getCoachById = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId;
        const coach = await coachesService.getCoachById(req.params.id, branchId);
        return (0, response_1.successResponse)({ res, data: coach });
    }
    catch (error) {
        next(error);
    }
};
exports.getCoachById = getCoachById;
const createCoach = async (req, res, next) => {
    try {
        const adminBranchId = req.scopedBranchId || req.user.branchId;
        const coach = await coachesService.createCoach(req.body, adminBranchId);
        return (0, response_1.successResponse)({ res, data: coach, statusCode: 201, message: 'Coach created successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.createCoach = createCoach;
const updateCoach = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId;
        const coach = await coachesService.updateCoach(req.params.id, branchId, req.body);
        return (0, response_1.successResponse)({ res, data: coach, message: 'Coach updated successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCoach = updateCoach;
const deleteCoach = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId;
        await coachesService.deleteCoach(req.params.id, branchId);
        return (0, response_1.successResponse)({ res, message: 'Coach deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCoach = deleteCoach;
const assignStudents = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId;
        await coachesService.assignStudents(req.params.id, branchId, req.body.studentIds);
        return (0, response_1.successResponse)({ res, message: 'Students assigned successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.assignStudents = assignStudents;
const unassignStudent = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId;
        await coachesService.unassignStudent(req.params.id, req.params.studentId, branchId);
        return (0, response_1.successResponse)({ res, message: 'Student unassigned successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.unassignStudent = unassignStudent;
