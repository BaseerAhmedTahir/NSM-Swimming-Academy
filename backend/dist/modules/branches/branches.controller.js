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
exports.updateBranch = exports.getBranchById = exports.getAllBranches = void 0;
const branchesService = __importStar(require("./branches.service"));
const response_1 = require("../../utils/response");
const getAllBranches = async (req, res, next) => {
    try {
        const branches = await branchesService.getAllBranches();
        return (0, response_1.successResponse)({ res, data: branches });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllBranches = getAllBranches;
const getBranchById = async (req, res, next) => {
    try {
        const branch = await branchesService.getBranchById(req.params.id);
        return (0, response_1.successResponse)({ res, data: branch });
    }
    catch (error) {
        next(error);
    }
};
exports.getBranchById = getBranchById;
const updateBranch = async (req, res, next) => {
    try {
        const branch = await branchesService.updateBranch(req.params.id, req.body);
        return (0, response_1.successResponse)({ res, data: branch, message: 'Branch updated successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.updateBranch = updateBranch;
