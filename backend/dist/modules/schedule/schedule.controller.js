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
exports.swapSlot = exports.removeSlot = exports.assignSlot = exports.getScheduleGrid = void 0;
const scheduleService = __importStar(require("./schedule.service"));
const response_1 = require("../../utils/response");
const getScheduleGrid = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId || req.query.branchId;
        const dateStr = req.query.date;
        if (!branchId)
            throw new Error('Branch ID is required');
        const grid = await scheduleService.getScheduleGrid(dateStr, branchId);
        return (0, response_1.successResponse)({ res, data: grid });
    }
    catch (error) {
        next(error);
    }
};
exports.getScheduleGrid = getScheduleGrid;
const assignSlot = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId || req.query.branchId;
        await scheduleService.assignSlot(req.body, branchId);
        return (0, response_1.successResponse)({ res, message: 'Slot assigned successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.assignSlot = assignSlot;
const removeSlot = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId || req.query.branchId;
        await scheduleService.removeSlot(req.body, branchId);
        return (0, response_1.successResponse)({ res, message: 'Slot cleared successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.removeSlot = removeSlot;
const swapSlot = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId || req.query.branchId;
        await scheduleService.swapSlot(req.body, branchId);
        return (0, response_1.successResponse)({ res, message: 'Slots swapped successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.swapSlot = swapSlot;
