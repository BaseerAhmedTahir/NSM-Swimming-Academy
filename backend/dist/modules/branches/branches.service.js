"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertBranchAdmin = exports.updateBranch = exports.getBranchById = exports.deleteBranch = exports.createBranch = exports.getAllBranches = void 0;
const database_1 = require("../../config/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getAllBranches = async () => {
    return await database_1.prisma.branch.findMany({
        where: { isActive: true },
        select: {
            id: true,
            name: true,
            code: true,
            address: true,
            phone: true,
            email: true,
            whatsapp: true,
            mapUrl: true,
            operatingHours: true,
            trn: true,
            permissions: true
        }
    });
};
exports.getAllBranches = getAllBranches;
const createBranch = async (data) => {
    return await database_1.prisma.branch.create({ data });
};
exports.createBranch = createBranch;
const deleteBranch = async (id) => {
    // Soft delete to preserve data integrity - sets isActive to false
    return await database_1.prisma.branch.update({
        where: { id },
        data: { isActive: false }
    });
};
exports.deleteBranch = deleteBranch;
const getBranchById = async (id) => {
    return await database_1.prisma.branch.findUniqueOrThrow({
        where: { id }
    });
};
exports.getBranchById = getBranchById;
const updateBranch = async (id, data) => {
    return await database_1.prisma.branch.update({
        where: { id },
        data
    });
};
exports.updateBranch = updateBranch;
const upsertBranchAdmin = async (branchId, data) => {
    // Verify branch exists
    await database_1.prisma.branch.findUniqueOrThrow({ where: { id: branchId } });
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    const cleanedUsername = data.username?.trim().toLowerCase();
    const cleanedEmail = data.email?.trim().toLowerCase();
    // Use a transaction to ensure atomicity
    return await database_1.prisma.$transaction(async (tx) => {
        // 1. Look for any existing staff admin for this branch
        const existingAdmins = await tx.admin.findMany({
            where: { branchId, role: 'STAFF' },
            orderBy: { createdAt: 'asc' }
        });
        let primaryAdmin;
        if (existingAdmins.length > 0) {
            // Update the oldest one as the primary
            primaryAdmin = await tx.admin.update({
                where: { id: existingAdmins[0].id },
                data: {
                    name: data.name,
                    username: cleanedUsername,
                    email: cleanedEmail,
                    password: hashedPassword,
                    isActive: true
                }
            });
            // 2. Delete ALL OTHER staff admins for this branch to prevent "old credentials" working
            if (existingAdmins.length > 1) {
                const otherIds = existingAdmins.slice(1).map(a => a.id);
                await tx.admin.deleteMany({
                    where: { id: { in: otherIds } }
                });
            }
        }
        else {
            // Create new one if none exist
            primaryAdmin = await tx.admin.create({
                data: {
                    name: data.name,
                    username: cleanedUsername,
                    email: cleanedEmail,
                    password: hashedPassword,
                    role: 'STAFF',
                    branchId,
                    isActive: true
                }
            });
        }
        return primaryAdmin;
    });
};
exports.upsertBranchAdmin = upsertBranchAdmin;
