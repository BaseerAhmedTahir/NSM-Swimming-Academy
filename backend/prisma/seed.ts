import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');
    
    // Create Branches
    const branches = [];
    const branchData = [
        { code: 'DXB', name: 'Dubai Marina', address: 'Marina', phone: '04333', email: 'dxb@nsm.com', whatsapp: '055' },
        { code: 'SHJ', name: 'Sharjah Corniche', address: 'Corniche', phone: '06555', email: 'shj@nsm.com', whatsapp: '056' },
        { code: 'AUH', name: 'Abu Dhabi Khalidiya', address: 'Khalidiya', phone: '02333', email: 'auh@nsm.com', whatsapp: '050' },
    ];
    for (const b of branchData) {
        branches.push(await prisma.branch.upsert({
            where: { code: b.code },
            update: {},
            create: b
        }));
    }

    // Create Admins
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // SUPER_ADMIN - HQ only, no branchId conflict
    await prisma.admin.upsert({
        where: { email: 'superadmin@nsm.com' },
        update: {},
        create: {
            username: 'superadmin',
            email: 'superadmin@nsm.com',
            password: hashedPassword,
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
            branchId: null
        }
    });

    // Branch STAFF admins - one per branch
    const branchAdmins = [
        { username: 'dubai_admin',  email: 'dubai@nsm.com',   name: 'Dubai Admin',    branch: branches[0] },
        { username: 'sharjah_admin',email: 'sharjah@nsm.com', name: 'Sharjah Admin',  branch: branches[1] },
        { username: 'abudhabi_admin',email:'abudhabi@nsm.com',name: 'Abu Dhabi Admin', branch: branches[2] },
    ];

    for (const a of branchAdmins) {
        await prisma.admin.upsert({
            where: { email: a.email },
            update: {},
            create: {
                username: a.username,
                email: a.email,
                password: hashedPassword,
                name: a.name,
                role: 'STAFF',
                branchId: a.branch.id
            }
        });
    }

    // Create Settings (Packages)
    const settings = [
        { key: 'PACKAGE_BASIC', value: JSON.stringify({ price: 500, classes: 8, durationMonths: 1 }), description: 'Basic Package Details' },
        { key: 'PACKAGE_SILVER', value: JSON.stringify({ price: 800, classes: 12, durationMonths: 1 }), description: 'Silver Package Details' },
        { key: 'PACKAGE_GOLD', value: JSON.stringify({ price: 1200, classes: 24, durationMonths: 3 }), description: 'Gold Package Details' },
        { key: 'PACKAGE_PLATINUM', value: JSON.stringify({ price: 1500, classes: 36, durationMonths: 6 }), description: 'Platinum Package Details' },
        { key: 'PACKAGE_INDIVIDUAL', value: JSON.stringify({ price: 2000, classes: 10, durationMonths: 1 }), description: 'Individual Package Details' },
    ];
    for (const s of settings) {
        await prisma.setting.upsert({
            where: { key: s.key },
            update: {},
            create: s
        });
    }

    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
