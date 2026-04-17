import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('admin123', 10);
    
    // Upsert a guaranteed superadmin
    await prisma.admin.upsert({
        where: { email: 'superadmin@nsm.com' },
        update: {
            username: 'superadmin@nsm.com',
            password: password,
            isActive: true,
            role: 'SUPER_ADMIN'
        },
        create: {
            username: 'superadmin@nsm.com',
            email: 'superadmin@nsm.com',
            password: password,
            name: 'Super Admin',
            isActive: true,
            role: 'SUPER_ADMIN'
        }
    });
    
    console.log('Super Admin account has been FORCED to:');
    console.log('Username/Email: superadmin@nsm.com');
    console.log('Password: admin123');
}

main().finally(() => prisma.$disconnect());
