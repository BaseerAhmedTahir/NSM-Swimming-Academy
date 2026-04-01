import { prisma } from '../../config/database';
import { getPaginationOptions, formatPaginatedResponse } from '../../utils/pagination';
import { generateStudentId, generateInvoiceNumber } from '../../utils/generateId';
import bcrypt from 'bcryptjs';
import { sendCredentialsEmail } from '../../utils/email';

// Helper: Dynamic package pricing lookup from Settings with fallback
const getPackageDetails = async (type: string, txClient: any = prisma) => {
    const settingKey = `PACKAGE_${type}`;
    const setting = await txClient.setting.findUnique({ where: { key: settingKey } });

    if (setting) {
        try {
            const parsed = JSON.parse(setting.value);
            // Ensure all required fields exist; durationMonths defaults to 1 if not set
            return {
                price: Number(parsed.price) || 0,
                classes: Number(parsed.classes) || 0,
                durationMonths: Number(parsed.durationMonths) || 1,
            };
        } catch (e) {
            console.warn(`Invalid JSON for ${settingKey}, using hardcoded defaults`);
        }
    } else {
        console.warn(`No DB setting found for key "${settingKey}" — using hardcoded defaults`);
    }

    const defaultPrices: Record<string, { price: number, classes: number, durationMonths: number }> = {
        BASIC: { price: 500, classes: 8, durationMonths: 1 },
        SILVER: { price: 800, classes: 12, durationMonths: 1 },
        GOLD: { price: 1200, classes: 24, durationMonths: 3 },
        PLATINUM: { price: 1500, classes: 36, durationMonths: 6 },
        INDIVIDUAL: { price: 2000, classes: 10, durationMonths: 1 },
    };

    return defaultPrices[type] || { price: 0, classes: 0, durationMonths: 1 };
};

export const searchStudents = async (query: string, branchId?: string) => {
    const where: any = { status: 'ACTIVE' };
    if (branchId) where.branchId = branchId;
    
    return await prisma.student.findMany({
        where: {
            ...where,
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { phone: { endsWith: query } },
                { studentId: { contains: query, mode: 'insensitive' } }
            ]
        },
        take: 10,
        select: { id: true, studentId: true, name: true, phone: true, level: true, status: true }
    });
};

export const getAllStudents = async (queryArgs: any, branchId?: string) => {
    // Soft update expired students dynamically
    await prisma.student.updateMany({
        where: {
            status: 'ACTIVE',
            membershipExpiryDate: { lt: new Date() }
        },
        data: { status: 'EXPIRED' }
    });

    const { page, limit, skip } = getPaginationOptions(queryArgs?.page, queryArgs?.limit);
    
    const where: any = {};
    if (branchId) where.branchId = branchId;
    if (queryArgs.status) where.status = queryArgs.status;
    if (queryArgs.level) where.level = queryArgs.level;
    if (queryArgs.packageType) where.packageType = queryArgs.packageType;
    if (queryArgs.search) {
        where.OR = [
            { name: { contains: queryArgs.search, mode: 'insensitive' } },
            { studentId: { contains: queryArgs.search, mode: 'insensitive' } }
        ];
    }

    // Never return passwords
    const [total, students] = await Promise.all([
        prisma.student.count({ where }),
        prisma.student.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true, studentId: true, name: true, email: true, phone: true,
                age: true, gender: true, level: true, category: true, packageType: true,
                status: true, membershipStartDate: true, membershipExpiryDate: true,
                trn: true, discount: true, renewalCount: true,
                branchId: true, branch: { select: { name: true } },
                payments: { orderBy: { createdAt: 'desc' }, take: 1 },
                membershipHistory: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { totalClasses: true, classesUsed: true, status: true }
                },
                createdAt: true
            }
        })
    ]);

    return formatPaginatedResponse(students, total, page, limit);
};

export const getStudentById = async (id: string, branchId?: string) => {
    const where = branchId ? { id, branchId } : { id };
    
    // Will throw if not found
    const student = await prisma.student.findFirstOrThrow({
        where,
        include: {
            branch: { select: { name: true } },
            membershipHistory: { orderBy: { createdAt: 'desc' }, take: 5 },
            coachAssignments: { include: { coach: { select: { id: true, name: true } } } }
        }
    });

    const { password: _, ...studentData } = student;
    return studentData;
};

// Admin directly creates an ACTIVE student (which generates payment + invoice)
export const createStudent = async (data: any, adminBranchId: string) => {
    const branchId = data.branchId || adminBranchId;
    const tempPassword = data.password; // Capture plaintext before hashing
    
    // 1. Database Operations in Transaction
    const transactionResult = await prisma.$transaction(async (tx: any) => {
        const branch = await tx.branch.findUniqueOrThrow({ where: { id: branchId } });
        
        // Find the student with the highest sequence number in this branch to avoid collisions
        const lastStudent = await tx.student.findFirst({
            where: { branchId },
            orderBy: { createdAt: 'desc' },
            select: { studentId: true }
        });

        let nextSequence = 1;
        if (lastStudent && lastStudent.studentId) {
            const parts = lastStudent.studentId.split('-');
            const lastSeq = parseInt(parts[parts.length - 1]);
            if (!isNaN(lastSeq)) {
                nextSequence = lastSeq + 1;
            }
        }

        const studentId = generateStudentId(branch.code, nextSequence);

        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        
        const packageInfo = await getPackageDetails(data.packageType, tx);
        const amount = packageInfo.price;
        const totalAmount = amount - (data.discount || 0);

        const startDate = new Date();
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + (packageInfo.durationMonths || 1));

        const student = await tx.student.create({
            data: {
                studentId, name: data.name, age: data.age, gender: data.gender,
                email: data.email, phone: data.phone, password: hashedPassword,
                level: data.level, category: data.category, packageType: data.packageType,
                branchId, discount: data.discount, trn: data.trn, privacyPolicyAccepted: true,
                status: 'ACTIVE',
                membershipStartDate: startDate,
                membershipExpiryDate: expiryDate,
            }
        });

        // 1. Create Payment
        // Find the payment with the highest sequence number in this branch for current year
        const year = new Date().getFullYear();
        const lastPayment = await tx.payment.findFirst({
            where: { 
                branchId,
                createdAt: { gte: new Date(year, 0, 1) }
            },
            orderBy: { createdAt: 'desc' },
            select: { invoiceNumber: true }
        });

        let nextPaySequence = 1;
        if (lastPayment && lastPayment.invoiceNumber) {
            const parts = lastPayment.invoiceNumber.split('-');
            const lastSeq = parseInt(parts[parts.length - 1]);
            if (!isNaN(lastSeq)) {
                nextPaySequence = lastSeq + 1;
            }
        }

        const invoiceNumber = generateInvoiceNumber(branch.code, nextPaySequence);
        
        const isPaid = data.paymentStatus === 'PAID';
        const paidAmount = isPaid ? totalAmount : 0;
        const pendingAmount = isPaid ? 0 : totalAmount;

        const payment = await tx.payment.create({
            data: {
                invoiceNumber, studentId: student.id, branchId,
                amount, discount: data.discount || 0,
                totalAmount, paidAmount, 
                pendingAmount,
                paymentMode: data.paymentMode, paymentDate: new Date(),
                status: data.paymentStatus, packageType: data.packageType, registrationType: 'NEW'
            }
        });

        // 2. Create Membership History
        await tx.membershipHistory.create({
            data: {
                studentId: student.id, packageType: data.packageType,
                startDate, expiryDate, totalClasses: packageInfo.classes,
                status: 'ACTIVE'
            }
        });

        const { password: _, ...studentData } = student;
        return studentData;
    });

    // 3. Send Credentials Email with temp password so student can log in
    const emailResult = await sendCredentialsEmail(
        transactionResult.email, 
        transactionResult.name, 
        transactionResult.studentId, 
        tempPassword
    ).catch(err => {
        console.error('Email system crash:', err);
        return { success: false, error: err.message };
    });

    return { ...transactionResult, emailResult };
};

export const updateStudent = async (id: string, branchId: string | undefined, data: any) => {
    const where = branchId ? { id, branchId } : { id };
    const existingStudent = await prisma.student.findFirstOrThrow({ 
        where,
        include: { payments: { orderBy: { createdAt: 'desc' }, take: 1 } }
    });

    // Fields that belong directly to the Student model
    const studentFields = [
        'name', 'age', 'gender', 'phone', 'email', 'level', 'category', 
        'discount', 'profileImage', 'packageType', 
        'membershipStartDate', 'membershipExpiryDate', 'trn'
    ];
    
    const studentUpdateData: any = {};
    studentFields.forEach(field => {
        if (data[field] !== undefined) {
            // Ensure dates are valid Date objects if provided
            if ((field === 'membershipStartDate' || field === 'membershipExpiryDate') && data[field]) {
                studentUpdateData[field] = new Date(data[field]);
            } else {
                studentUpdateData[field] = data[field];
            }
        }
    });

    // Handle branchId separately as a relation connection to avoid scalar issues
    if (data.branchId) {
        studentUpdateData.branch = { connect: { id: data.branchId } };
    }

    // Auto update status if expiry date is edited to the past
    const checkDate = studentUpdateData.membershipExpiryDate || existingStudent.membershipExpiryDate;
    if (checkDate) {
        if (checkDate < new Date() && existingStudent.status === 'ACTIVE') {
            studentUpdateData.status = 'EXPIRED';
        } else if (checkDate >= new Date() && existingStudent.status === 'EXPIRED') {
            studentUpdateData.status = 'ACTIVE';
        }
    }

    return await prisma.$transaction(async (tx: any) => {
        const student = await tx.student.update({
            where: { id },
            data: studentUpdateData,
            include: { branch: { select: { name: true } } }
        });

        // Handle Payment Updates if provided
        if (existingStudent.payments[0]) {
            const lastPayment = existingStudent.payments[0];
            const paymentUpdate: any = {};
            
            // Recalculate amounts if package or discount changes
            const newPackageType = data.packageType || existingStudent.packageType;
            const newDiscount = data.discount !== undefined ? data.discount : existingStudent.discount;
            
            if (data.packageType || data.discount !== undefined) {
                const packageInfo = await getPackageDetails(newPackageType, tx);
                paymentUpdate.amount = packageInfo.price;
                paymentUpdate.discount = newDiscount;
                paymentUpdate.totalAmount = packageInfo.price - newDiscount;
                
                // Adjust pending amount based on status
                const currentStatus = data.paymentStatus || lastPayment.status;
                if (currentStatus === 'PAID') {
                    paymentUpdate.paidAmount = paymentUpdate.totalAmount;
                    paymentUpdate.pendingAmount = 0;
                } else {
                    // Keep existing paid amount, recalculate pending
                    paymentUpdate.pendingAmount = Math.max(0, paymentUpdate.totalAmount - lastPayment.paidAmount);
                    if (paymentUpdate.pendingAmount === 0 && lastPayment.paidAmount > 0) {
                        paymentUpdate.status = 'PAID';
                    }
                }
            }

            if (data.paymentStatus && lastPayment.status !== data.paymentStatus) {
                const isPaid = data.paymentStatus === 'PAID';
                paymentUpdate.status = data.paymentStatus;
                // If force-marking as PAID, update amounts
                if (isPaid) {
                    const finalTotal = paymentUpdate.totalAmount || lastPayment.totalAmount;
                    paymentUpdate.paidAmount = finalTotal;
                    paymentUpdate.pendingAmount = 0;
                }
            }

            if (data.packageType && lastPayment.packageType !== data.packageType) {
                paymentUpdate.packageType = data.packageType;
            }

            if (data.paymentMode && lastPayment.paymentMode !== data.paymentMode) {
                paymentUpdate.paymentMode = data.paymentMode;
            }

            if (Object.keys(paymentUpdate).length > 0) {
                await tx.payment.update({
                    where: { id: lastPayment.id },
                    data: paymentUpdate
                });
            }
        }

        // ── Update MembershipHistory when packageType changes ──────────────
        if (data.packageType && data.packageType !== existingStudent.packageType) {
            const newPkgInfo = await getPackageDetails(data.packageType, tx);
            // Find the latest membership record for this student (any status) and update totalClasses
            const latestMembership = await tx.membershipHistory.findFirst({
                where: { studentId: id },
                orderBy: { createdAt: 'desc' },
                select: { id: true }
            });
            if (latestMembership) {
                await tx.membershipHistory.update({
                    where: { id: latestMembership.id },
                    data: {
                        packageType: data.packageType,
                        totalClasses: newPkgInfo.classes,
                    }
                });
            }
        }
        
        const { password: _, ...studentData } = student;
        return studentData;
    });
};

export const activateStudent = async (id: string, branchId: string | undefined, data: any) => {
    const where = branchId ? { id, branchId } : { id };
    const student = await prisma.student.findFirstOrThrow({ where });

    if (student.status === 'ACTIVE') throw new Error('Student is already active');

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    const updated = await prisma.student.update({
        where: { id },
        data: {
            status: 'ACTIVE',
            packageType: data?.packageType || student.packageType,
            membershipStartDate: student.membershipStartDate || startDate,
            membershipExpiryDate: student.membershipExpiryDate || expiryDate
        }
    });

    const { password: _, ...studentData } = updated;
    return studentData;
};

export const renewStudent = async (id: string, branchId: string | undefined, data: any) => {
    const where = branchId ? { id, branchId } : { id };
    
    return await prisma.$transaction(async (tx: any) => {
        const student = await tx.student.findFirstOrThrow({ where: { ...where } });
        const branch = await tx.branch.findUniqueOrThrow({ where: { id: student.branchId } });
        
        const packageInfo = await getPackageDetails(data.packageType, tx);
        const amount = packageInfo.price;
        const totalAmount = amount - (data.discount || 0);

        const startDate = new Date(); // Could append to existing expiryDate instead
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + (packageInfo.durationMonths || 1));

        const updatedStudent = await tx.student.update({
            where: { id },
            data: {
                status: 'ACTIVE', // If they were EXPIRED
                packageType: data.packageType,
                membershipStartDate: startDate,
                membershipExpiryDate: expiryDate,
                renewalCount: { increment: 1 }
            }
        });

        // Generate Payment
        const paymentCount = await tx.payment.count({ where: { branchId: student.branchId, createdAt: { gte: new Date(new Date().getFullYear(), 0, 1) } } });
        const invoiceNumber = generateInvoiceNumber(branch.code, paymentCount + 1);
        
        const isPaid = data.paymentStatus === 'PAID';
        const paidAmount = isPaid ? totalAmount : 0;
        const pendingAmount = isPaid ? 0 : totalAmount;

        await tx.payment.create({
            data: {
                invoiceNumber, studentId: student.id, branchId: student.branchId,
                amount, discount: data.discount || 0,
                totalAmount, paidAmount, 
                pendingAmount,
                paymentMode: data.paymentMode, paymentDate: new Date(),
                status: data.paymentStatus || 'PENDING', packageType: data.packageType, registrationType: 'RENEW'
            }
        });

        // Mark old membership history as EXPIRED/COMPLETED and create new
        await tx.membershipHistory.updateMany({
            where: { studentId: student.id, status: 'ACTIVE' },
            data: { status: 'COMPLETED' }
        });

        await tx.membershipHistory.create({
            data: {
                studentId: student.id, packageType: data.packageType,
                startDate, expiryDate, totalClasses: packageInfo.classes,
                status: 'ACTIVE'
            }
        });

        const { password: _, ...studentData } = updatedStudent;
        return studentData;
    });
};

export const cancelStudent = async (id: string, branchId?: string) => {
    const where = branchId ? { id, branchId } : { id };
    await prisma.student.findFirstOrThrow({ where });

    return await prisma.$transaction(async (tx: any) => {
        // 1. Update student status
        const student = await tx.student.update({
            where: { id },
            data: { status: 'CANCELLED' }
        });

        // 2. Terminate any active membership history
        await tx.membershipHistory.updateMany({
            where: { studentId: id, status: 'ACTIVE' },
            data: { status: 'CANCELLED' }
        });

        // 3. Remove from future schedule slots
        await tx.scheduleSlot.updateMany({
            where: { studentId: id },
            data: { studentId: null }
        });

        return student;
    });
};

export const deleteStudent = async (id: string, branchId?: string) => {
    const where = branchId ? { id, branchId } : { id };
    await prisma.student.findFirstOrThrow({ where });

    return await prisma.$transaction(async (tx: any) => {
        // Delete all related records first to satisfy constraints
        await tx.attendanceRecord.deleteMany({ where: { studentId: id } });
        await tx.payment.deleteMany({ where: { studentId: id } });
        await tx.membershipHistory.deleteMany({ where: { studentId: id } });
        await tx.freezing.deleteMany({ where: { studentId: id } });
        await tx.cancellation.deleteMany({ where: { studentId: id } });
        await tx.studentNotification.deleteMany({ where: { studentId: id } });
        await tx.coachStudentAssignment.deleteMany({ where: { studentId: id } });
        await tx.scheduleSlot.updateMany({ where: { studentId: id }, data: { studentId: null } });
        await tx.refreshToken.deleteMany({ where: { studentId: id } });

        return await tx.student.delete({
            where: { id }
        });
    });
};

export const getStudentPayments = async (id: string, branchId?: string, isStaff: boolean = false) => {
    const where = branchId ? { id, branchId } : { id };
    await prisma.student.findFirstOrThrow({ where });

    if (isStaff) {
        return await prisma.payment.findMany({
            where: { studentId: id },
            orderBy: { createdAt: 'desc' },
            select: { id: true, invoiceNumber: true, paymentMode: true, paymentDate: true, status: true, packageType: true, registrationType: true }
        });
    }

    return await prisma.payment.findMany({
        where: { studentId: id },
        orderBy: { createdAt: 'desc' },
        include: { installments: true }
    });
};

export const getStudentAttendance = async (id: string, branchId?: string) => {
    const where = branchId ? { id, branchId } : { id };
    await prisma.student.findFirstOrThrow({ where });

    return await prisma.attendanceRecord.findMany({
        where: { studentId: id },
        orderBy: { date: 'desc' },
        include: { scheduleSlot: true }
    });
};

export const getStudentMembershipHistory = async (id: string, branchId?: string) => {
    const where = branchId ? { id, branchId } : { id };
    await prisma.student.findFirstOrThrow({ where });

    return await prisma.membershipHistory.findMany({
        where: { studentId: id },
        orderBy: { createdAt: 'desc' },
    });
};

// All expired membership records for the expired history screen:
// - COMPLETED/EXPIRED history = students who expired and have since been renewed (permanent history)
// - ACTIVE history for EXPIRED students = newly expired, not yet renewed (current expired screen)
export const getExpiredHistory = async (branchId?: string) => {
    const studentWhere = branchId ? { branchId } : {};
    return await prisma.membershipHistory.findMany({
        where: {
            OR: [
                // Historically expired (already renewed — status COMPLETED)
                { status: { in: ['COMPLETED', 'EXPIRED'] }, student: studentWhere },
                // Currently expired but not yet renewed (student.status = EXPIRED, history still ACTIVE)
                { status: 'ACTIVE', student: { ...studentWhere, status: 'EXPIRED' } }
            ]
        },
        orderBy: { expiryDate: 'desc' },
        include: {
            student: {
                select: {
                    id: true, studentId: true, name: true, phone: true,
                    status: true, // include so frontend can show if currently expired or already renewed
                    branch: { select: { id: true, name: true } }
                }
            }
        }
    });
};


