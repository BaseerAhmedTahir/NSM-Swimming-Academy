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
    // Look for existing admin for this branch
    const existingAdmin = await database_1.prisma.admin.findFirst({
        where: { branchId, role: 'STAFF' }
    });
    if (existingAdmin) {
        return await database_1.prisma.admin.update({
            where: { id: existingAdmin.id },
            data: {
                name: data.name,
                username: data.username,
                email: data.email,
                password: hashedPassword
            }
        });
    }
    else {
        return await database_1.prisma.admin.create({
            data: {
                name: data.name,
                username: data.username,
                email: data.email,
                password: hashedPassword,
                role: 'STAFF',
                branchId
            }
        });
    }
};
exports.upsertBranchAdmin = upsertBranchAdmin;
