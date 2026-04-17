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
    const cleanedUsername = data.username?.trim().toLowerCase();
    const cleanedEmail = data.email?.trim().toLowerCase();

    // Use a transaction to ensure atomicity
    return await prisma.$transaction(async (tx) => {
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
        } else {
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
