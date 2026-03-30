import { z } from 'zod';
import { prisma } from '../../config/database';
import { adminLoginSchema, studentRegisterSchema, studentLoginSchema, resetPasswordSchema, forgotPasswordSchema } from './auth.schema';
import { UnauthorizedError, NotFoundError, ConflictError, ValidationError, ForbiddenError } from '../../utils/errors';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { generateTokens } from '../../utils/jwt';
import { generateStudentId } from '../../utils/generateId';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../../utils/email';

// Default password reset expiry is 1 hour
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000;

export const adminLogin = async (data: z.infer<typeof adminLoginSchema>['body']) => {
    const admin = await prisma.admin.findUnique({
        where: { username: data.username },
        include: { branch: true }
    });

    if (!admin || !admin.isActive) {
        throw new UnauthorizedError('Invalid credentials');
    }

    if (data.branchId) {
        if (admin.role === 'SUPER_ADMIN') {
            throw new UnauthorizedError('Super Admins must use the HQ Login portal.');
        }
        if (admin.branchId !== data.branchId) {
            throw new UnauthorizedError('Invalid branch access');
        }
    } else {
        if (admin.role !== 'SUPER_ADMIN') {
            throw new UnauthorizedError('A branch ID is required for non-HQ logins.');
        }
    }

    const isMatch = await bcrypt.compare(data.password, admin.password);
    if (!isMatch) {
        throw new UnauthorizedError('Invalid credentials');
    }

    // Parse branch permissions to embed in JWT for middleware enforcement
    let permissions: string[] | undefined;
    if (admin.role === 'STAFF' && admin.branch?.permissions) {
        try {
            permissions = typeof admin.branch.permissions === 'string'
                ? JSON.parse(admin.branch.permissions)
                : admin.branch.permissions;
        } catch {
            permissions = ['dashboard', 'schedule', 'registration', 'payments', 'coaches', 'reminders'];
        }
    }

    const tokens = generateTokens({ id: admin.id, role: admin.role, branchId: admin.branchId, permissions });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
    await prisma.refreshToken.create({
        data: { token: tokens.refreshToken, adminId: admin.id, expiresAt }
    });

    await prisma.admin.update({ where: { id: admin.id }, data: { lastLogin: new Date() } });

    // Avoid returning password
    const { password: _, ...adminData } = admin;
    return { ...tokens, admin: adminData };
};

export const studentRegister = async (data: z.infer<typeof studentRegisterSchema>['body']) => {
    // Check for duplicate email or phone
    const existing = await prisma.student.findFirst({
        where: { OR: [{ email: data.email }, { phone: data.phone }] }
    });
    if (existing) throw new ConflictError('Email or phone already registered');

    const countInBranch = await prisma.student.count({ where: { branchId: data.branchId } });
    const branch = await prisma.branch.findUnique({ where: { id: data.branchId } });
    if (!branch) throw new NotFoundError('Branch not found');

    const studentId = generateStudentId(branch.code, countInBranch + 1);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Self-registration via mobile: fill required DB fields with defaults
    // Admin will complete the profile when activating the student
    const student = await prisma.student.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            branchId: data.branchId,
            studentId,
            status: 'PENDING',
            age: data.age ?? 0,                      // Admin fills in during activation
            gender: data.gender ?? 'MALE',           // Admin fills in during activation
            level: data.level ?? 'Beginner',         // Admin fills in during activation
            category: data.category ?? 'ADULT',      // Admin fills in during activation
            packageType: data.packageType ?? 'BASIC', // Admin fills in during activation
            privacyPolicyAccepted: data.privacyPolicyAccepted ?? true,
            privacyPolicyAcceptedAt: new Date(),
        }
    });

    sendWelcomeEmail(student.email, student.name, studentId).catch(console.error);
    
    const { password: _, ...studentData } = student;
    return studentData;
};

export const studentLogin = async (data: z.infer<typeof studentLoginSchema>['body']) => {
    const student = await prisma.student.findFirst({
        where: { OR: [{ email: data.emailOrPhone }, { phone: data.emailOrPhone }] },
        include: { branch: { select: { id: true, name: true } } }
    });

    if (!student) throw new UnauthorizedError('Invalid credentials');
    if (student.status === 'PENDING') throw new ForbiddenError('Account is pending approval. Please wait for admin activation.');
    if (student.status === 'CANCELLED') throw new ForbiddenError('Account has been cancelled.');

    const isMatch = await bcrypt.compare(data.password, student.password);
    if (!isMatch) throw new UnauthorizedError('Invalid credentials');

    const tokens = generateTokens({ id: student.id, role: 'STUDENT', branchId: student.branchId });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await prisma.refreshToken.create({
        data: { token: tokens.refreshToken, studentId: student.id, expiresAt }
    });

    const { password: _, ...studentData } = student;
    // Return branch in user object so mobile app can save admin-assigned branch immediately
    return { ...tokens, user: studentData };
};


export const refreshToken = async (token: string) => {
    const storedToken = await prisma.refreshToken.findUnique({
        where: { token },
        include: { admin: true, student: true }
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedError('ERR_TOKEN_EXPIRED', 'Refresh token invalid or expired');
    }

    const { admin, student } = storedToken;
    let payload = null;
    
    if (admin) payload = { id: admin.id, role: admin.role, branchId: admin.branchId };
    else if (student) payload = { id: student.id, role: 'STUDENT', branchId: student.branchId };
    
    if (!payload) throw new UnauthorizedError('Token is disconnected from user');

    // Generate NEW tokens, specifically the new access token
    const newTokens = generateTokens(payload);
    
    return { accessToken: newTokens.accessToken };
};

export const logout = async (token: string) => {
    await prisma.refreshToken.update({
        where: { token },
        data: { revoked: true, revokedAt: new Date() }
    });
};

export const forgotPassword = async (email: string) => {
    const admin = await prisma.admin.findUnique({ where: { email } });
    const student = await prisma.student.findFirst({ where: { email } });

    if (!admin && !student) {
        // Obscure whether email exists or not to prevent enumeration
        return; 
    }

    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

    await prisma.passwordResetToken.create({
        data: { email, token: resetToken, expiresAt }
    });

    sendPasswordResetEmail(email, resetToken).catch(console.error);
};

export const resetPassword = async (data: z.infer<typeof resetPasswordSchema>['body']) => {
    const resetRecord = await prisma.passwordResetToken.findUnique({ where: { token: data.token } });

    if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
        throw new ValidationError('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    const { email } = resetRecord;

    await prisma.$transaction(async (tx: any) => {
        const student = await tx.student.findFirst({ where: { email } });
        if (student) {
            await tx.student.update({ where: { id: student.id }, data: { password: hashedPassword } });
            await tx.refreshToken.updateMany({ where: { studentId: student.id }, data: { revoked: true } });
        } else {
            const admin = await tx.admin.findUnique({ where: { email } });
            if (admin) {
                await tx.admin.update({ where: { id: admin.id }, data: { password: hashedPassword } });
                await tx.refreshToken.updateMany({ where: { adminId: admin.id }, data: { revoked: true } });
            }
        }
        
        await tx.passwordResetToken.update({ where: { id: resetRecord.id }, data: { used: true } });
    });
};
