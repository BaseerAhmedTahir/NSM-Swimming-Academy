/**
 * reset.ts — Clean slate script for production handover
 *
 * Deletes ALL transactional / test data while respecting foreign key constraints.
 *
 * KEEPS:
 *   - Branches (Dubai, Sharjah, Abu Dhabi)
 *   - Global Settings
 *
 * DELETES:
 *   - ALL Admins (including ghost Super Admins)
 *   - All Students & Coaches
 *   - All Schedules, Payments, Notifications, etc.
 *
 * RECREATES:
 *   - A single, clean Super Admin account.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('⚠️  Starting production reset...\n');

    // --- 1. Delete in dependency order (Children before Parents) ---
    const tables = [
        'attendanceRecord',
        'classCancellation',
        'studentNotification',
        'installment',
        'payment',
        'membershipHistory',
        'freezing',
        'cancellation',
        'coachStudentAssignment',
        'scheduleSlot',
        'schedule',
        'student',
        'coach',
        'notification',
        'reminder',
        'refreshToken',
        'passwordResetToken',
        'activityLog'
    ];

    for (const table of tables) {
        console.log(`🗑  Deleting ${table}...`);
        try {
            await (prisma as any)[table].deleteMany({});
        } catch (e) {
            console.log(`    ⚠️  Could not delete ${table}`);
        }
    }

    // --- 2. Delete ALL existing admins for a completely clean start ---
    console.log('🗑  Purging all Admin records...');
    await prisma.admin.deleteMany({});

    // --- 3. Create the ONE and ONLY Super Admin account ---
    const password = await bcrypt.hash('admin123', 10);
    console.log('🔑  Creating fresh Super Admin (superadmin@nsm.com)...');
    await prisma.admin.create({
        data: {
            username: 'superadmin@nsm.com',
            email: 'superadmin@nsm.com',
            password: password,
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
            branchId: null,
            isActive: true
        }
    });

    console.log('\n✅  Reset complete! The database is now at a factory state.');
    console.log('\n📋  Handover Access Details:');
    console.log('    ──────────────────────────────────────────────────');
    console.log('    1. Visit the login page.');
    console.log('    2. Select the "HQ Login" tab.');
    console.log('    3. Use the credentials below:');
    console.log('       - Username: superadmin@nsm.com');
    console.log('       - Password: admin123');
    console.log('    ──────────────────────────────────────────────────');
}

main()
    .catch((e) => {
        console.error('❌  Reset failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
