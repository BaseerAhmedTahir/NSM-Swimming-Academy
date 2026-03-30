import winston from 'winston';
import { env } from '../config/env';
import { Request, Response, NextFunction } from 'express';

const logFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += JSON.stringify(metadata);
    }
    return msg;
});

export const logger = winston.createLogger({
    level: env.LOG_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize(),
        logFormat
    ),
    transports: [
        new winston.transports.Console()
        // Here we could add file transports for production
    ],
});

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    logger.http({
        message: `${req.method} ${req.url}`,
        ip: req.ip,
        userAgent: req.get('user-agent') || '',
    });
    next();
};
