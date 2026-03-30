"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const env_1 = require("../config/env");
const logFormat = winston_1.default.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += JSON.stringify(metadata);
    }
    return msg;
});
exports.logger = winston_1.default.createLogger({
    level: env_1.env.LOG_LEVEL,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.colorize(), logFormat),
    transports: [
        new winston_1.default.transports.Console()
        // Here we could add file transports for production
    ],
});
const loggerMiddleware = (req, res, next) => {
    exports.logger.http({
        message: `${req.method} ${req.url}`,
        ip: req.ip,
        userAgent: req.get('user-agent') || '',
    });
    next();
};
exports.loggerMiddleware = loggerMiddleware;
