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
exports.updateFreezing = exports.unfreeze = exports.createFreezing = exports.getFreezingById = exports.getFreezings = void 0;
const freezingsService = __importStar(require("./freezings.service"));
const response_1 = require("../../utils/response");
const getFreezings = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId;
        const result = await freezingsService.getFreezings(branchId, req.query);
        return (0, response_1.successResponse)({ res, data: result.data, meta: result.meta });
    }
    catch (error) {
        next(error);
    }
};
exports.getFreezings = getFreezings;
const getFreezingById = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId;
        const record = await freezingsService.getFreezingById(req.params.id, branchId);
        return (0, response_1.successResponse)({ res, data: record });
    }
    catch (error) {
        next(error);
    }
};
exports.getFreezingById = getFreezingById;
const createFreezing = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId;
        const adminId = req.user.id;
        const record = await freezingsService.createFreezing({ ...req.body, frozenBy: adminId }, branchId);
        return (0, response_1.successResponse)({ res, data: record, statusCode: 201, message: 'Account frozen successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.createFreezing = createFreezing;
const unfreeze = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId;
        await freezingsService.unfreeze(req.params.id, branchId, req.body);
        return (0, response_1.successResponse)({ res, message: 'Account unfrozen successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.unfreeze = unfreeze;
const updateFreezing = async (req, res, next) => {
    try {
        const branchId = req.scopedBranchId;
        const record = await freezingsService.updateFreezing(req.params.id, branchId, req.body);
        return (0, response_1.successResponse)({ res, data: record, message: 'Freezing record updated successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.updateFreezing = updateFreezing;
