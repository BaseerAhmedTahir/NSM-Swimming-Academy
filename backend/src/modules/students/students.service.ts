import { prisma } from '../../config/database';
import { getPaginationOptions, formatPaginatedResponse } from '../../utils/pagination';
import { generateStudentId, generateInvoiceNumber } from '../../utils/generateId';
import bcrypt from 'bcryptjs';
import { sendCredentialsEmail } from '../../utils/email';

// Helper: Dynamic package pricing lookup from Settings with fallback
const getPackageDetails = async (type: string, branchId?: string, txClient: any = prisma) => {
    let settingKey = `PACKAGE_${type}`;
    let setting = null;
    
    if (branchId) {
        setting = await txClient.setting.findUnique({ where: { key: `${settingKey}_${branchId}` } });
    }
    
    if (!setting) {
        setting = await txClient.setting.findUnique({ where: { key: settingKey } });
    }

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
    // Soft update expired students dynamically (Date-based)
    await prisma.student.updateMany({
        where: {
            status: 'ACTIVE',
            membershipExpiryDate: { lt: new Date() }
        },
        data: { status: 'EXPIRED' }
    });

    // Soft update students who have used all their classes (accounting for freeClasses)
    const activeMemberships = await prisma.membershipHistory.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, studentId: true, classesUsed: true, totalClasses: true, freeClasses: true }
    });
    const exhaustedIds = activeMemberships.filter(m => m.classesUsed >= (m.totalClasses + (m.freeClasses || 0))).map(m => m.studentId);
    if (exhaustedIds.length > 0) {
        await prisma.student.updateMany({
            where: { id: { in: exhaustedIds }, status: 'ACTIVE' },
            data: { status: 'EXPIRED' }
        });
        await prisma.membershipHistory.updateMany({
            where: { studentId: { in: exhaustedIds }, status: 'ACTIVE' },
            data: { status: 'COMPLETED' }
        });
    }

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
                    select: { totalClasses: true, classesUsed: true, freeClasses: true, status: true }
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
        
        const packageInfo = await getPackageDetails(data.packageType, branchId, tx);
        const amount = packageInfo.price;
        const discountAmount = data.discount || 0;
        const subTotal = Math.max(0, amount - discountAmount);
        const vatAmount = data.vatAmount !== undefined ? data.vatAmount : parseFloat((subTotal * 0.05).toFixed(2));
        const totalAmount = subTotal + vatAmount;

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
        
        let paidAmount = 0;
        if (data.paymentStatus === 'PAID') {
            paidAmount = totalAmount;
        } else if (data.paymentStatus === 'PARTIAL' && data.paidAmount !== undefined) {
            paidAmount = data.paidAmount;
        }
        const pendingAmount = Math.max(0, totalAmount - paidAmount);

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
                freeClasses: data.freeClasses || 0,
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
            
            if (data.packageType || data.discount !== undefined || data.paymentStatus || data.paidAmount !== undefined) {
                if (data.packageType || data.discount !== undefined) {
                    const packageInfo = await getPackageDetails(newPackageType, existingStudent.branchId, tx);
                    const subTotal = Math.max(0, packageInfo.price - newDiscount);
                    const vatAmount = data.vatAmount !== undefined ? data.vatAmount : parseFloat((subTotal * 0.05).toFixed(2));
                    paymentUpdate.amount = packageInfo.price;
                    paymentUpdate.discount = newDiscount;
                    paymentUpdate.totalAmount = subTotal + vatAmount;
                }
                
                const currentTotal = paymentUpdate.totalAmount !== undefined ? paymentUpdate.totalAmount : lastPayment.totalAmount;
                const currentPaid = data.paidAmount !== undefined ? data.paidAmount : lastPayment.paidAmount;
                const newStatus = data.paymentStatus || lastPayment.status;

                let finalStatus = newStatus;
                let finalPaid = currentPaid;

                if (newStatus === 'PAID') {
                    finalPaid = currentTotal;
                } else if (newStatus === 'PENDING') {
                    finalPaid = 0;
                }

                const finalPending = Math.max(0, currentTotal - finalPaid);

                if (finalStatus === 'PARTIAL' && finalPending === 0 && finalPaid > 0) {
                    finalStatus = 'PAID';
                }

                if (finalStatus !== lastPayment.status) paymentUpdate.status = finalStatus;
                if (finalPaid !== lastPayment.paidAmount) paymentUpdate.paidAmount = finalPaid;
                if (finalPending !== lastPayment.pendingAmount) paymentUpdate.pendingAmount = finalPending;
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

        // ── Update MembershipHistory when packageType or freeClasses changes ──────────────
        const membershipUpdateData: any = {};
        if (data.packageType && data.packageType !== existingStudent.packageType) {
            const newPkgInfo = await getPackageDetails(data.packageType, existingStudent.branchId, tx);
            membershipUpdateData.packageType = data.packageType;
            membershipUpdateData.totalClasses = newPkgInfo.classes;
        }
        if (data.freeClasses !== undefined) {
            membershipUpdateData.freeClasses = data.freeClasses;
        }
        if (Object.keys(membershipUpdateData).length > 0) {
            const latestMembership = await tx.membershipHistory.findFirst({
                where: { studentId: id },
                orderBy: { createdAt: 'desc' },
                select: { id: true }
            });
            if (latestMembership) {
                await tx.membershipHistory.update({
                    where: { id: latestMembership.id },
                    data: membershipUpdateData
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
        
        const packageInfo = await getPackageDetails(data.packageType, student.branchId, tx);
        const amount = packageInfo.price;
        const discountAmount = data.discount || 0;
        const subTotal = Math.max(0, amount - discountAmount);
        const vatAmount = data.vatAmount !== undefined ? data.vatAmount : parseFloat((subTotal * 0.05).toFixed(2));
        const totalAmount = subTotal + vatAmount;

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
        
        let paidAmount = 0;
        if (data.paymentStatus === 'PAID') {
            paidAmount = totalAmount;
        } else if (data.paymentStatus === 'PARTIAL' && data.paidAmount !== undefined) {
            paidAmount = data.paidAmount;
        }
        const pendingAmount = Math.max(0, totalAmount - paidAmount);

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
                freeClasses: data.freeClasses || 0,
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

    const history = await prisma.membershipHistory.findMany({
        where: { studentId: id },
        orderBy: { createdAt: 'desc' },
    });

    const payments = await prisma.payment.findMany({
        where: { studentId: id },
        orderBy: { createdAt: 'desc' },
        include: { installments: { orderBy: { createdAt: 'desc' } } }
    });

    // Get attendance records for the student
    const attendanceRecords = await prisma.attendanceRecord.findMany({
        where: { studentId: id },
        select: { date: true, status: true },
        orderBy: { date: 'desc' }
    });

    // Get coach assignments
    const coachAssignments = await prisma.coachStudentAssignment.findMany({
        where: { studentId: id },
        include: { coach: { select: { id: true, name: true, coachId: true } } },
        orderBy: { assignedAt: 'desc' }
    });

    return history.map(h => {
        // Match payment created within 2 minutes of the membership history
        const relatedPayment = payments.find(p => 
            p.packageType === h.packageType &&
            Math.abs(p.createdAt.getTime() - h.createdAt.getTime()) < 120000
        );

        // Count attendance within this membership period
        const periodAttendance = attendanceRecords.filter(a => {
            const aDate = new Date(a.date);
            return aDate >= new Date(h.startDate) && aDate <= new Date(h.expiryDate);
        });
        const attendedCount = periodAttendance.filter(a => a.status === 'ATTENDED').length;
        const absentCount = periodAttendance.filter(a => a.status === 'ABSENT' || a.status === 'INFORMED').length;

        return {
            ...h,
            // Payment details
            paidAmount: relatedPayment ? relatedPayment.paidAmount : null,
            totalAmount: relatedPayment ? relatedPayment.totalAmount : null,
            pendingAmount: relatedPayment ? relatedPayment.pendingAmount : null,
            paymentStatus: relatedPayment ? relatedPayment.status : null,
            paymentMode: relatedPayment ? relatedPayment.paymentMode : null,
            discount: relatedPayment ? relatedPayment.discount : null,
            paymentDate: relatedPayment ? relatedPayment.paymentDate : null,
            invoiceNumber: relatedPayment ? relatedPayment.invoiceNumber : null,
            paymentId: relatedPayment ? relatedPayment.id : null,
            installments: relatedPayment ? relatedPayment.installments : [],
            // Attendance summary
            attendedClasses: attendedCount,
            absentClasses: absentCount,
            // Coach info
            coaches: coachAssignments.map(ca => ({
                id: ca.coach.id,
                name: ca.coach.name,
                coachId: ca.coach.coachId,
                assignedAt: ca.assignedAt
            }))
        };
    });
};

// All expired membership records for the expired history screen:
// - COMPLETED/EXPIRED history = students who expired and have since been renewed (permanent history)
// - ACTIVE history for EXPIRED students = newly expired, not yet renewed (current expired screen)
export const getExpiredHistory = async (branchId?: string) => {
    // Soft update expired students dynamically (Date-based)
    await prisma.student.updateMany({
        where: {
            status: 'ACTIVE',
            membershipExpiryDate: { lt: new Date() }
        },
        data: { status: 'EXPIRED' }
    });

    // Soft update students who have used all their classes
    const activeMemberships = await prisma.membershipHistory.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, studentId: true, classesUsed: true, totalClasses: true }
    });
    const exhaustedIds = activeMemberships.filter(m => m.classesUsed >= m.totalClasses).map(m => m.studentId);
    if (exhaustedIds.length > 0) {
        await prisma.student.updateMany({
            where: { id: { in: exhaustedIds }, status: 'ACTIVE' },
            data: { status: 'EXPIRED' }
        });
        await prisma.membershipHistory.updateMany({
            where: { studentId: { in: exhaustedIds }, status: 'ACTIVE' },
            data: { status: 'COMPLETED' }
        });
    }

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


