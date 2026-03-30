"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const cron_service_1 = require("./services/cron.service");
const startServer = async () => {
    try {
        (0, cron_service_1.initCronJobs)();
        app_1.default.listen(env_1.env.PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running in ${env_1.env.NODE_ENV} mode on port ${env_1.env.PORT}`);
            console.log(`🩺 Health check: http://localhost:${env_1.env.PORT}${env_1.env.API_PREFIX}/health`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
