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
exports.submitReview = exports.getStats = exports.getAll = void 0;
const reviewsService = __importStar(require("./reviews.service"));
const getAll = async (req, res, next) => {
    try {
        const branchId = req.user?.role === 'STAFF' ? req.user.branchId : undefined;
        const data = await reviewsService.getAllReviews(req.query, branchId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const getStats = async (req, res, next) => {
    try {
        const branchId = req.user?.role === 'STAFF' ? req.user.branchId : req.query.branchId;
        const data = await reviewsService.getReviewStats(branchId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getStats = getStats;
const submitReview = async (req, res, next) => {
    try {
        const studentId = req.user?.id;
        const branchId = req.user?.branchId;
        if (!studentId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const review = await reviewsService.createReview(studentId, branchId, req.body);
        res.status(201).json({ success: true, data: review });
    }
    catch (err) {
        next(err);
    }
};
exports.submitReview = submitReview;
