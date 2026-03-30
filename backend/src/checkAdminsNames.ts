import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkAdmins() {
    const all = await prisma.admin.findMany({ select: { name: true, username: true, role: true, branchId: true } });
    console.log(JSON.stringify(all, null, 2));
    await prisma.$disconnect();
}
checkAdmins();
