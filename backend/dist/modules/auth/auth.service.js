"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.logout = exports.refreshToken = exports.studentLogin = exports.studentRegister = exports.adminLogin = void 0;
const database_1 = require("../../config/database");
const errors_1 = require("../../utils/errors");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const jwt_1 = require("../../utils/jwt");
const generateId_1 = require("../../utils/generateId");
const email_1 = require("../../utils/email");
// Default password reset expiry is 1 hour
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000;
const adminLogin = async (data) => {
    const admin = await database_1.prisma.admin.findUnique({
        where: { username: data.username },
        include: { branch: true }
    });
    if (!admin || !admin.isActive) {
        throw new errors_1.UnauthorizedError('Invalid credentials');
    }
    if (data.branchId) {
        if (admin.role === 'SUPER_ADMIN') {
            throw new errors_1.UnauthorizedError('Super Admins must use the HQ Login portal.');
        }
        if (admin.branchId !== data.branchId) {
            throw new errors_1.UnauthorizedError('Invalid branch access');
        }
    }
    else {
        if (admin.role !== 'SUPER_ADMIN') {
            throw new errors_1.UnauthorizedError('A branch ID is required for non-HQ logins.');
        }
    }
    const isMatch = await bcryptjs_1.default.compare(data.password, admin.password);
    if (!isMatch) {
        throw new errors_1.UnauthorizedError('Invalid credentials');
    }
    // Parse branch permissions to embed in JWT for middleware enforcement
    let permissions;
    if (admin.role === 'STAFF' && admin.branch?.permissions) {
        try {
            permissions = typeof admin.branch.permissions === 'string'
                ? JSON.parse(admin.branch.permissions)
                : admin.branch.permissions;
        }
        catch {
            permissions = ['dashboard', 'schedule', 'registration', 'payments', 'coaches', 'reminders'];
        }
    }
    const tokens = (0, jwt_1.generateTokens)({ id: admin.id, role: admin.role, branchId: admin.branchId, permissions });
    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
    await database_1.prisma.refreshToken.create({
        data: { token: tokens.refreshToken, adminId: admin.id, expiresAt }
    });
    await database_1.prisma.admin.update({ where: { id: admin.id }, data: { lastLogin: new Date() } });
    // Avoid returning password
    const { password: _, ...adminData } = admin;
    return { ...tokens, admin: adminData };
};
exports.adminLogin = adminLogin;
const studentRegister = async (data) => {
    // Check for duplicate email or phone
    const existing = await database_1.prisma.student.findFirst({
        where: { OR: [{ email: data.email }, { phone: data.phone }] }
    });
    if (existing)
        throw new errors_1.ConflictError('Email or phone already registered');
    const countInBranch = await database_1.prisma.student.count({ where: { branchId: data.branchId } });
    const branch = await database_1.prisma.branch.findUnique({ where: { id: data.branchId } });
    if (!branch)
        throw new errors_1.NotFoundError('Branch not found');
    const studentId = (0, generateId_1.generateStudentId)(branch.code, countInBranch + 1);
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    // Self-registration via mobile: fill required DB fields with defaults
    // Admin will complete the profile when activating the student
    const student = await database_1.prisma.student.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            branchId: data.branchId,
            studentId,
            status: 'PENDING',
            age: data.age ?? 0, // Admin fills in during activation
            gender: data.gender ?? 'MALE', // Admin fills in during activation
            level: data.level ?? 'Beginner', // Admin fills in during activation
            category: data.category ?? 'ADULT', // Admin fills in during activation
            packageType: data.packageType ?? 'BASIC', // Admin fills in during activation
            privacyPolicyAccepted: data.privacyPolicyAccepted ?? true,
            privacyPolicyAcceptedAt: new Date(),
        }
    });
    (0, email_1.sendWelcomeEmail)(student.email, student.name, studentId).catch(console.error);
    const { password: _, ...studentData } = student;
    return studentData;
};
exports.studentRegister = studentRegister;
const studentLogin = async (data) => {
    const student = await database_1.prisma.student.findFirst({
        where: { OR: [{ email: data.emailOrPhone }, { phone: data.emailOrPhone }] },
        include: { branch: { select: { id: true, name: true } } }
    });
    if (!student)
        throw new errors_1.UnauthorizedError('Invalid credentials');
    if (student.status === 'PENDING')
        throw new errors_1.ForbiddenError('Account is pending approval. Please wait for admin activation.');
    if (student.status === 'CANCELLED')
        throw new errors_1.ForbiddenError('Account has been cancelled.');
    const isMatch = await bcryptjs_1.default.compare(data.password, student.password);
    if (!isMatch)
        throw new errors_1.UnauthorizedError('Invalid credentials');
    const tokens = (0, jwt_1.generateTokens)({ id: student.id, role: 'STUDENT', branchId: student.branchId });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await database_1.prisma.refreshToken.create({
        data: { token: tokens.refreshToken, studentId: student.id, expiresAt }
    });
    const { password: _, ...studentData } = student;
    // Return branch in user object so mobile app can save admin-assigned branch immediately
    return { ...tokens, user: studentData };
};
exports.studentLogin = studentLogin;
const refreshToken = async (token) => {
    const storedToken = await database_1.prisma.refreshToken.findUnique({
        where: { token },
        include: { admin: true, student: true }
    });
    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
        throw new errors_1.UnauthorizedError('ERR_TOKEN_EXPIRED', 'Refresh token invalid or expired');
    }
    const { admin, student } = storedToken;
    let payload = null;
    if (admin)
        payload = { id: admin.id, role: admin.role, branchId: admin.branchId };
    else if (student)
        payload = { id: student.id, role: 'STUDENT', branchId: student.branchId };
    if (!payload)
        throw new errors_1.UnauthorizedError('Token is disconnected from user');
    // Generate NEW tokens, specifically the new access token
    const newTokens = (0, jwt_1.generateTokens)(payload);
    return { accessToken: newTokens.accessToken };
};
exports.refreshToken = refreshToken;
const logout = async (token) => {
    await database_1.prisma.refreshToken.update({
        where: { token },
        data: { revoked: true, revokedAt: new Date() }
    });
};
exports.logout = logout;
const forgotPassword = async (email) => {
    const admin = await database_1.prisma.admin.findUnique({ where: { email } });
    const student = await database_1.prisma.student.findFirst({ where: { email } });
    if (!admin && !student) {
        // Obscure whether email exists or not to prevent enumeration
        return;
    }
    const resetToken = (0, uuid_1.v4)();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
    await database_1.prisma.passwordResetToken.create({
        data: { email, token: resetToken, expiresAt }
    });
    (0, email_1.sendPasswordResetEmail)(email, resetToken).catch(console.error);
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (data) => {
    const resetRecord = await database_1.prisma.passwordResetToken.findUnique({ where: { token: data.token } });
    if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
        throw new errors_1.ValidationError('Invalid or expired reset token');
    }
    const hashedPassword = await bcryptjs_1.default.hash(data.newPassword, 10);
    const { email } = resetRecord;
    await database_1.prisma.$transaction(async (tx) => {
        const student = await tx.student.findFirst({ where: { email } });
        if (student) {
            await tx.student.update({ where: { id: student.id }, data: { password: hashedPassword } });
            await tx.refreshToken.updateMany({ where: { studentId: student.id }, data: { revoked: true } });
        }
        else {
            const admin = await tx.admin.findUnique({ where: { email } });
            if (admin) {
                await tx.admin.update({ where: { id: admin.id }, data: { password: hashedPassword } });
                await tx.refreshToken.updateMany({ where: { adminId: admin.id }, data: { revoked: true } });
            }
        }
        await tx.passwordResetToken.update({ where: { id: resetRecord.id }, data: { used: true } });
    });
};
exports.resetPassword = resetPassword;
