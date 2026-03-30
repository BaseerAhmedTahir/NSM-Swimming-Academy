"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env file
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('5000').transform(Number),
    API_PREFIX: zod_1.z.string().default('/api/v1'),
    DATABASE_URL: zod_1.z.string(),
    JWT_ACCESS_SECRET: zod_1.z.string().min(32),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32),
    JWT_ACCESS_EXPIRY: zod_1.z.string().default('1h'),
    JWT_REFRESH_EXPIRY: zod_1.z.string().default('30d'),
    CORS_ORIGINS: zod_1.z.string().transform((val) => val.split(',').map((origin) => origin.trim())),
    EMAIL_PROVIDER: zod_1.z.enum(['resend', 'gmail']).default('resend'),
    RESEND_API_KEY: zod_1.z.string().optional(),
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.string().optional().transform(v => v ? Number(v) : undefined),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    SMTP_SECURE: zod_1.z.string().optional().transform(v => v === 'true'),
    EMAIL_FROM: zod_1.z.string().email(),
    EMAIL_FROM_NAME: zod_1.z.string(),
    RATE_LIMIT_WINDOW_MS: zod_1.z.string().default('900000').transform(Number), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: zod_1.z.string().default('100').transform(Number),
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
    REMINDER_POLL_INTERVAL_SECONDS: zod_1.z.string().default('60').transform(Number),
    CANCELLATION_THRESHOLD_HOURS: zod_1.z.string().default('2').transform(Number),
    MAX_STUDENTS_PER_SLOT: zod_1.z.string().default('6').transform(Number),
    DEFAULT_TIME_SLOTS: zod_1.z.string().transform((val) => val.split(',').map(s => s.trim())),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    process.exit(1);
}
exports.env = _env.data;
