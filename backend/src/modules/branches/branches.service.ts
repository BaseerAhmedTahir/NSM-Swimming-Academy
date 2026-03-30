import { prisma } from '../../config/database';
import bcrypt from 'bcryptjs';

export const getAllBranches = async () => {
    return await prisma.branch.findMany({
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

export const createBranch = async (data: any) => {
    return await prisma.branch.create({ data });
};

export const deleteBranch = async (id: string) => {
    // Soft delete to preserve data integrity - sets isActive to false
    return await prisma.branch.update({
        where: { id },
        data: { isActive: false }
    });
};

export const getBranchById = async (id: string) => {
    return await prisma.branch.findUniqueOrThrow({
        where: { id }
    });
};

export const updateBranch = async (id: string, data: any) => {
    return await prisma.branch.update({
        where: { id },
        data
    });
};

export const upsertBranchAdmin = async (branchId: string, data: any) => {
    // Verify branch exists
    await prisma.branch.findUniqueOrThrow({ where: { id: branchId } });

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Look for existing admin for this branch
    const existingAdmin = await prisma.admin.findFirst({
        where: { branchId, role: 'STAFF' }
    });

    if (existingAdmin) {
        return await prisma.admin.update({
            where: { id: existingAdmin.id },
            data: {
                name: data.name,
                username: data.username,
                email: data.email,
                password: hashedPassword
            }
        });
    } else {
        return await prisma.admin.create({
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
