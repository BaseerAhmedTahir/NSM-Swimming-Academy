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
exports.resetPassword = exports.forgotPassword = exports.logout = exports.refreshToken = exports.studentLogin = exports.studentRegister = exports.adminLogin = void 0;
const authService = __importStar(require("./auth.service"));
const response_1 = require("../../utils/response");
const adminLogin = async (req, res, next) => {
    try {
        const result = await authService.adminLogin(req.body);
        return (0, response_1.successResponse)({ res, data: result, message: 'Admin login successful' });
    }
    catch (error) {
        next(error);
    }
};
exports.adminLogin = adminLogin;
const studentRegister = async (req, res, next) => {
    try {
        const result = await authService.studentRegister(req.body);
        return (0, response_1.successResponse)({
            res,
            data: result,
            message: 'Registration successful. Please wait for admin approval.',
            statusCode: 201
        });
    }
    catch (error) {
        next(error);
    }
};
exports.studentRegister = studentRegister;
const studentLogin = async (req, res, next) => {
    try {
        const result = await authService.studentLogin(req.body);
        return (0, response_1.successResponse)({ res, data: result, message: 'Student login successful' });
    }
    catch (error) {
        next(error);
    }
};
exports.studentLogin = studentLogin;
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshToken(refreshToken);
        return (0, response_1.successResponse)({ res, data: result, message: 'Token refreshed successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        await authService.logout(refreshToken);
        return (0, response_1.successResponse)({ res, message: 'Logged out successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const forgotPassword = async (req, res, next) => {
    try {
        await authService.forgotPassword(req.body.email);
        return (0, response_1.successResponse)({ res, message: 'If an account exists, a password reset link has been sent.' });
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        await authService.resetPassword(req.body);
        return (0, response_1.successResponse)({ res, message: 'Password has been reset successfully. You can now login.' });
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
