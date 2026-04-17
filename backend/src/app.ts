import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { corsOptions } from './config/cors';
import { errorHandler } from './middleware/errorHandler';
import { loggerMiddleware } from './middleware/logger';
import { globalLimiter } from './middleware/rateLimiter';

import authRoutes from './modules/auth/auth.routes';
import branchesRoutes from './modules/branches/branches.routes';
import coachesRoutes from './modules/coaches/coaches.routes';
import studentsRoutes from './modules/students/students.routes';
import scheduleRoutes from './modules/schedule/schedule.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import invoicesRoutes from './modules/invoices/invoices.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import remindersRoutes from './modules/reminders/reminders.routes';
import cancellationsRoutes from './modules/cancellations/cancellations.routes';
import freezingsRoutes from './modules/freezings/freezings.routes';
import reportsRoutes from './modules/reports/reports.routes';
import settingsRoutes from './modules/settings/settings.routes';
import studentAppRoutes from './modules/student-app/student-app.routes';
import reviewsRoutes from './modules/reviews/reviews.routes';
import expensesRoutes from './modules/expenses/expenses.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app: Express = express();

// Trust proxy for rate limiting (essential for Railway/Heroku/Cloudflare)
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
app.use('/api', globalLimiter);

// Logging
app.use(loggerMiddleware);

// Health Check
app.get(`${env.API_PREFIX}/health`, (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'NSM Swimming Academy API is running smoothly.', timestamp: new Date().toISOString() });
});

// Routes
app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/branches`, branchesRoutes);
app.use(`${env.API_PREFIX}/coaches`, coachesRoutes);
app.use(`${env.API_PREFIX}/students`, studentsRoutes);
app.use(`${env.API_PREFIX}/schedules`, scheduleRoutes);
app.use(`${env.API_PREFIX}/attendance`, attendanceRoutes);
app.use(`${env.API_PREFIX}/payments`, paymentsRoutes);
app.use(`${env.API_PREFIX}/invoices`, invoicesRoutes);
app.use(`${env.API_PREFIX}/notifications`, notificationsRoutes);
app.use(`${env.API_PREFIX}/reminders`, remindersRoutes);
app.use(`${env.API_PREFIX}/cancellations`, cancellationsRoutes);
app.use(`${env.API_PREFIX}/freezings`, freezingsRoutes);
app.use(`${env.API_PREFIX}/reports`, reportsRoutes);


app.use(`${env.API_PREFIX}/settings`, settingsRoutes);
app.use(`${env.API_PREFIX}/student-app`, studentAppRoutes);
app.use(`${env.API_PREFIX}/reviews`, reviewsRoutes);
app.use(`${env.API_PREFIX}/expenses`, expensesRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 Handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, error: { code: 'ERR_NOT_FOUND', details: 'Route not found' } });
});

// Global Error Handler
app.use(errorHandler);

export default app;
