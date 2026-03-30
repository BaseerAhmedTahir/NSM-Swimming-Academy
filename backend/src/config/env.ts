import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform(Number),
  API_PREFIX: z.string().default('/api/v1'),
  
  DATABASE_URL: z.string(),
  
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('1h'),
  JWT_REFRESH_EXPIRY: z.string().default('30d'),
  
  CORS_ORIGINS: z.string().transform((val) => val.split(',').map((origin) => origin.trim())),
  
  EMAIL_PROVIDER: z.enum(['resend', 'gmail']).default('resend'),
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional().transform(v => v ? Number(v) : undefined),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_SECURE: z.string().optional().transform(v => v === 'true'),
  EMAIL_FROM: z.string().email(),
  EMAIL_FROM_NAME: z.string(),
  
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
  
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  
  REMINDER_POLL_INTERVAL_SECONDS: z.string().default('60').transform(Number),
  CANCELLATION_THRESHOLD_HOURS: z.string().default('2').transform(Number),
  MAX_STUDENTS_PER_SLOT: z.string().default('6').transform(Number),
  DEFAULT_TIME_SLOTS: z.string().transform((val) => val.split(',').map(s => s.trim())),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
