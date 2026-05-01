"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const cors_2 = require("./config/cors");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./middleware/logger");
const rateLimiter_1 = require("./middleware/rateLimiter");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const branches_routes_1 = __importDefault(require("./modules/branches/branches.routes"));
const coaches_routes_1 = __importDefault(require("./modules/coaches/coaches.routes"));
const students_routes_1 = __importDefault(require("./modules/students/students.routes"));
const schedule_routes_1 = __importDefault(require("./modules/schedule/schedule.routes"));
const attendance_routes_1 = __importDefault(require("./modules/attendance/attendance.routes"));
const payments_routes_1 = __importDefault(require("./modules/payments/payments.routes"));
const invoices_routes_1 = __importDefault(require("./modules/invoices/invoices.routes"));
const notifications_routes_1 = __importDefault(require("./modules/notifications/notifications.routes"));
const reminders_routes_1 = __importDefault(require("./modules/reminders/reminders.routes"));
const cancellations_routes_1 = __importDefault(require("./modules/cancellations/cancellations.routes"));
const freezings_routes_1 = __importDefault(require("./modules/freezings/freezings.routes"));
const reports_routes_1 = __importDefault(require("./modules/reports/reports.routes"));
const settings_routes_1 = __importDefault(require("./modules/settings/settings.routes"));
const student_app_routes_1 = __importDefault(require("./modules/student-app/student-app.routes"));
const reviews_routes_1 = __importDefault(require("./modules/reviews/reviews.routes"));
const expenses_routes_1 = __importDefault(require("./modules/expenses/expenses.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const app = (0, express_1.default)();
// Trust proxy for rate limiting (essential for Railway/Heroku/Cloudflare)
app.set('trust proxy', 1);
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(cors_2.corsOptions));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Rate Limiting
app.use('/api', rateLimiter_1.globalLimiter);
// Logging
app.use(logger_1.loggerMiddleware);
// Health Check
app.get(`${env_1.env.API_PREFIX}/health`, (req, res) => {
    res.status(200).json({ success: true, message: 'NSM Swimming Academy API is running smoothly.', timestamp: new Date().toISOString() });
});
// Routes
app.use(`${env_1.env.API_PREFIX}/auth`, auth_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/branches`, branches_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/coaches`, coaches_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/students`, students_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/schedules`, schedule_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/attendance`, attendance_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/payments`, payments_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/invoices`, invoices_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/notifications`, notifications_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/reminders`, reminders_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/cancellations`, cancellations_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/freezings`, freezings_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/reports`, reports_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/settings`, settings_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/student-app`, student_app_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/reviews`, reviews_routes_1.default);
app.use(`${env_1.env.API_PREFIX}/expenses`, expenses_routes_1.default);
// Swagger Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: { code: 'ERR_NOT_FOUND', details: 'Route not found' } });
});
// Global Error Handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
