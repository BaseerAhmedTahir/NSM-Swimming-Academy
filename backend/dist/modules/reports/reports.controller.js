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
exports.getReport = void 0;
const reportsService = __importStar(require("./reports.service"));
const response_1 = require("../../utils/response");
const getReport = async (req, res, next) => {
    try {
        const type = req.params.type; // e.g. 'revenue', 'attendance', 'students'
        const format = req.query.format || 'JSON';
        // Merge scopedBranchId into queryArgs so the service correctly scopes data
        const queryArgs = { ...req.query };
        if (req.scopedBranchId) {
            queryArgs.branchId = req.scopedBranchId;
        }
        const data = await reportsService.generateReportData(type, queryArgs);
        if (format === 'PDF') {
            const doc = await reportsService.createPdfReportStream(type, data);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${type}_report.pdf"`);
            doc.pipe(res);
            doc.end();
            return;
        }
        else if (format === 'EXCEL') {
            const workbook = await reportsService.createExcelReport(type, data);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${type}_report.xlsx"`);
            await workbook.xlsx.write(res);
            res.end();
            return;
        }
        return (0, response_1.successResponse)({ res, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getReport = getReport;
