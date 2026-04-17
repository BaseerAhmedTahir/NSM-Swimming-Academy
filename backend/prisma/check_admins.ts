import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const admins = await prisma.admin.findMany({
        include: { branch: true }
    });
    
    let output = `Found ${admins.length} admins.\n`;
    admins.forEach(a => {
        output += `--- ADMIN ---\n`;
        output += `ID: ${a.id}\n`;
        output += `Username: ${a.username}\n`;
        output += `Email: ${a.email}\n`;
        output += `Role: ${a.role}\n`;
        output += `Branch Name: ${a.branch?.name || 'N/A'}\n`;
        output += `Branch ID: ${a.branchId || 'N/A'}\n`;
    });
    
    fs.writeFileSync('admins_debug.txt', output);
    console.log('Results written to admins_debug.txt');
}

main().finally(() => prisma.$disconnect());
