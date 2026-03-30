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
exports.updateInstallment = exports.createInstallment = exports.getPaymentStats = exports.updatePayment = exports.createPayment = exports.getPaymentById = exports.getAllPayments = void 0;
const paymentsService = __importStar(require("./payments.service"));
const response_1 = require("../../utils/response");
const getAllPayments = async (req, res, next) => {
    try {
        const branchId = req.query.branchId;
        const result = await paymentsService.getAllPayments(req.query, branchId);
        return (0, response_1.successResponse)({ res, data: result.data, meta: result.meta });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllPayments = getAllPayments;
const getPaymentById = async (req, res, next) => {
    try {
        const branchId = req.query.branchId;
        const payment = await paymentsService.getPaymentById(req.params.id, branchId);
        return (0, response_1.successResponse)({ res, data: payment });
    }
    catch (error) {
        next(error);
    }
};
exports.getPaymentById = getPaymentById;
const createPayment = async (req, res, next) => {
    try {
        const adminBranchId = req.user.branchId;
        const payment = await paymentsService.createPayment(req.body, adminBranchId);
        return (0, response_1.successResponse)({ res, data: payment, statusCode: 201, message: 'Payment created successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.createPayment = createPayment;
const updatePayment = async (req, res, next) => {
    try {
        const branchId = req.query.branchId;
        const payment = await paymentsService.updatePayment(req.params.id, branchId, req.body);
        return (0, response_1.successResponse)({ res, data: payment, message: 'Payment updated successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePayment = updatePayment;
const getPaymentStats = async (req, res, next) => {
    try {
        const branchId = req.query.branchId;
        const stats = await paymentsService.getPaymentStats(branchId);
        return (0, response_1.successResponse)({ res, data: stats });
    }
    catch (error) {
        next(error);
    }
};
exports.getPaymentStats = getPaymentStats;
const createInstallment = async (req, res, next) => {
    try {
        const branchId = req.query.branchId;
        const installment = await paymentsService.createInstallment(req.body, branchId);
        return (0, response_1.successResponse)({ res, data: installment, statusCode: 201, message: 'Installment created successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.createInstallment = createInstallment;
const updateInstallment = async (req, res, next) => {
    try {
        const branchId = req.query.branchId;
        const installment = await paymentsService.updateInstallment(req.params.id, branchId, req.body);
        return (0, response_1.successResponse)({ res, data: installment, message: 'Installment updated successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.updateInstallment = updateInstallment;
