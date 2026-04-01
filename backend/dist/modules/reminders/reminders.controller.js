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
exports.deleteReminder = exports.snoozeReminder = exports.updateReminder = exports.createReminder = exports.getReminders = void 0;
const remindersService = __importStar(require("./reminders.service"));
const response_1 = require("../../utils/response");
const getReminders = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId;
        const result = await remindersService.getReminders(branchId, req.query);
        return (0, response_1.successResponse)({ res, data: result.data, meta: result.meta });
    }
    catch (error) {
        next(error);
    }
};
exports.getReminders = getReminders;
const createReminder = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId || req.user.branchId;
        const reminder = await remindersService.createReminder(req.body, branchId, req.user.id);
        return (0, response_1.successResponse)({ res, data: reminder, statusCode: 201, message: 'Reminder created successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.createReminder = createReminder;
const updateReminder = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId;
        const reminder = await remindersService.updateReminder(req.params.id, branchId, req.body);
        return (0, response_1.successResponse)({ res, data: reminder, message: 'Reminder updated successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.updateReminder = updateReminder;
const snoozeReminder = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId;
        const reminder = await remindersService.snoozeReminder(req.params.id, branchId, req.body.snoozeUntil);
        return (0, response_1.successResponse)({ res, data: reminder, message: 'Reminder snoozed' });
    }
    catch (error) {
        next(error);
    }
};
exports.snoozeReminder = snoozeReminder;
const deleteReminder = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId;
        await remindersService.deleteReminder(req.params.id, branchId);
        return (0, response_1.successResponse)({ res, message: 'Reminder deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteReminder = deleteReminder;
