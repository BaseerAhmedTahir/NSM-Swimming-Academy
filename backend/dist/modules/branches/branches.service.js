"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBranch = exports.getBranchById = exports.getAllBranches = void 0;
const database_1 = require("../../config/database");
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
            trn: true
        }
    });
};
exports.getAllBranches = getAllBranches;
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
