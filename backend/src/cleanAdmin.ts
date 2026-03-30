import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function cleanAdmin() {
    await prisma.admin.updateMany({
        where: { role: 'SUPER_ADMIN' },
        data: { branchId: null }
    });
    console.log('Stripped branch ID from Super Admins.');
    await prisma.$disconnect();
}
cleanAdmin();
