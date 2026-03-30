import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

async function checkAdmins() {
    const admin1 = await prisma.admin.findUnique({ where: { username: 'admin1' }, select: { username: true, role: true, branchId: true } });
    const all = await prisma.admin.findMany({ select: { username: true, role: true, branchId: true } });
    
    fs.writeFileSync('admin_check.json', JSON.stringify({ admin1, all }, null, 2));

    await prisma.$disconnect();
}
checkAdmins();
