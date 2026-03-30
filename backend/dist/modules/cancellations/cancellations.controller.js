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
exports.updateCancellation = exports.createCancellation = exports.getCancellationById = exports.getCancellations = void 0;
const cancellationsService = __importStar(require("./cancellations.service"));
const response_1 = require("../../utils/response");
const getCancellations = async (req, res, next) => {
    try {
        const branchId = req.query.branchId;
        const result = await cancellationsService.getCancellations(branchId, req.query);
        return (0, response_1.successResponse)({ res, data: result.data, meta: result.meta });
    }
    catch (error) {
        next(error);
    }
};
exports.getCancellations = getCancellations;
const getCancellationById = async (req, res, next) => {
    try {
        const branchId = req.query.branchId;
        const record = await cancellationsService.getCancellationById(req.params.id, branchId);
        return (0, response_1.successResponse)({ res, data: record });
    }
    catch (error) {
        next(error);
    }
};
exports.getCancellationById = getCancellationById;
const createCancellation = async (req, res, next) => {
    try {
        const branchId = req.query.branchId;
        const record = await cancellationsService.createCancellation(req.body, branchId);
        return (0, response_1.successResponse)({ res, data: record, statusCode: 201, message: 'Student membership cancelled successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.createCancellation = createCancellation;
const updateCancellation = async (req, res, next) => {
    try {
        const branchId = req.query.branchId;
        const record = await cancellationsService.updateCancellation(req.params.id, branchId, req.body);
        return (0, response_1.successResponse)({ res, data: record, message: 'Cancellation record updated successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCancellation = updateCancellation;
