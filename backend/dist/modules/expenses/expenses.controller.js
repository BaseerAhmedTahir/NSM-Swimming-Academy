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
exports.remove = exports.update = exports.create = exports.getStats = exports.getAll = void 0;
const expensesService = __importStar(require("./expenses.service"));
const getAll = async (req, res, next) => {
    try {
        const branchId = req.user?.role === 'STAFF' ? req.user.branchId : undefined;
        const data = await expensesService.getAllExpenses(req.query, branchId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const getStats = async (req, res, next) => {
    try {
        const branchId = req.user?.role === 'STAFF' ? req.user.branchId : undefined;
        const data = await expensesService.getExpenseStats(req.query, branchId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getStats = getStats;
const create = async (req, res, next) => {
    try {
        const adminId = req.user?.id;
        if (!adminId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const data = await expensesService.createExpense(req.body, adminId);
        res.status(201).json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const data = await expensesService.updateExpense(req.params.id, req.body);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        await expensesService.deleteExpense(req.params.id);
        res.json({ success: true, message: 'Expense deleted successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.remove = remove;
