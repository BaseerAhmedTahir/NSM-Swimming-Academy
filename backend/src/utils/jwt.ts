import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateTokens = (payload: { id: string; role: string; branchId?: string | null; permissions?: string[] }) => {
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRY as any,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRY as any,
    });

    return { accessToken, refreshToken };
};
