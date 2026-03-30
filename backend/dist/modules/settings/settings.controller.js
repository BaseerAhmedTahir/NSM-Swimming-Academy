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
exports.saveSettings = exports.getSettings = void 0;
const settingsService = __importStar(require("./settings.service"));
const response_1 = require("../../utils/response");
const getSettings = async (req, res, next) => {
    try {
        const category = req.query.category;
        const settings = await settingsService.getSettingsByCategory(category);
        return (0, response_1.successResponse)({ res, data: settings });
    }
    catch (error) {
        next(error);
    }
};
exports.getSettings = getSettings;
const saveSettings = async (req, res, next) => {
    try {
        const { settings } = req.body;
        const result = await settingsService.saveSettingsBulk(settings);
        return (0, response_1.successResponse)({ res, data: result, message: 'Settings saved successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.saveSettings = saveSettings;
