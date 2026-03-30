"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentMembershipHistory = exports.getStudentAttendance = exports.getStudentPayments = exports.deleteStudent = exports.cancelStudent = exports.renewStudent = exports.activateStudent = exports.updateStudent = exports.createStudent = exports.getStudentById = exports.getAllStudents = exports.searchStudents = void 0;
const database_1 = require("../../config/database");
const pagination_1 = require("../../utils/pagination");
const generateId_1 = require("../../utils/generateId");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const email_1 = require("../../utils/email");
// Helper: Dynamic package pricing lookup from Settings with fallback
const getPackageDetails = async (type, txClient = database_1.prisma) => {
    const settingKey = `PACKAGE_${type}`;
    const setting = await txClient.setting.findUnique({ where: { key: settingKey } });
    if (setting) {
        try {
            return JSON.parse(setting.value); // Expected: { price: number, classes: number, durationMonths: number }
        }
        catch (e) {
            console.warn(`Invalid setting JSON for ${settingKey}, falling back to defaults`);
        }
    }
    const defaultPrices = {
        BASIC: { price: 500, classes: 8, durationMonths: 1 },
        SILVER: { price: 800, classes: 12, durationMonths: 1 },
        GOLD: { price: 1200, classes: 24, durationMonths: 3 },
        PLATINUM: { price: 1500, classes: 36, durationMonths: 6 },
        INDIVIDUAL: { price: 2000, classes: 10, durationMonths: 1 }
    };
    let details = defaultPrices[type] || defaultPrices.BASIC;
    if (setting) {
        try {
            details = JSON.parse(setting.value);
        }
        catch (e) {
            console.warn(`Invalid setting JSON for ${settingKey}, falling back to defaults`);
        }
    }
    // Force hard-correction for BASIC package to ensure it's always 500 regardless of DB
    if (type === 'BASIC') {
        details.price = 500;
    }
    return details;
};
const searchStudents = async (query, branchId) => {
    const where = { status: 'ACTIVE' };
    if (branchId)
        where.branchId = branchId;
    return await database_1.prisma.student.findMany({
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
exports.searchStudents = searchStudents;
const getAllStudents = async (queryArgs, branchId) => {
    // Soft update expired students dynamically
    await database_1.prisma.student.updateMany({
        where: {
            status: 'ACTIVE',
            membershipExpiryDate: { lt: new Date() }
        },
        data: { status: 'EXPIRED' }
    });
    const { page, limit, skip } = (0, pagination_1.getPaginationOptions)(queryArgs?.page, queryArgs?.limit);
    const where = {};
    if (branchId)
        where.branchId = branchId;
    if (queryArgs.status)
        where.status = queryArgs.status;
    if (queryArgs.level)
        where.level = queryArgs.level;
    if (queryArgs.packageType)
        where.packageType = queryArgs.packageType;
    if (queryArgs.search) {
        where.OR = [
            { name: { contains: queryArgs.search, mode: 'insensitive' } },
            { studentId: { contains: queryArgs.search, mode: 'insensitive' } }
        ];
    }
    // Never return passwords
    const [total, students] = await Promise.all([
        database_1.prisma.student.count({ where }),
        database_1.prisma.student.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true, studentId: true, name: true, email: true, phone: true,
                age: true, gender: true, level: true, category: true, packageType: true,
                status: true, membershipStartDate: true, membershipExpiryDate: true,
                branchId: true, branch: { select: { name: true } },
                payments: { orderBy: { createdAt: 'desc' }, take: 1 },
                createdAt: true
            }
        })
    ]);
    return (0, pagination_1.formatPaginatedResponse)(students, total, page, limit);
};
exports.getAllStudents = getAllStudents;
const getStudentById = async (id, branchId) => {
    const where = branchId ? { id, branchId } : { id };
    // Will throw if not found
    const student = await database_1.prisma.student.findFirstOrThrow({
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
exports.getStudentById = getStudentById;
// Admin directly creates an ACTIVE student (which generates payment + invoice)
const createStudent = async (data, adminBranchId) => {
    const branchId = data.branchId || adminBranchId;
    return await database_1.prisma.$transaction(async (tx) => {
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
        const studentId = (0, generateId_1.generateStudentId)(branch.code, nextSequence);
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
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
        const invoiceNumber = (0, generateId_1.generateInvoiceNumber)(branch.code, nextPaySequence);
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
        // 3. Send Welcome Email
        const emailResult = await (0, email_1.sendWelcomeEmail)(student.email, student.name, studentId).catch(err => {
            console.error('Email system crash:', err);
            return { success: false, error: err.message };
        });
        const { password: _, ...studentData } = student;
        return { ...studentData, emailResult };
    });
};
exports.createStudent = createStudent;
const updateStudent = async (id, branchId, data) => {
    const where = branchId ? { id, branchId } : { id };
    const existingStudent = await database_1.prisma.student.findFirstOrThrow({
        where,
        include: { payments: { orderBy: { createdAt: 'desc' }, take: 1 } }
    });
    // Fields that belong directly to the Student model
    const studentFields = [
        'name', 'age', 'gender', 'phone', 'email', 'level', 'category',
        'discount', 'profileImage', 'packageType',
        'membershipStartDate', 'membershipExpiryDate', 'trn'
    ];
    const studentUpdateData = {};
    studentFields.forEach(field => {
        if (data[field] !== undefined) {
            // Ensure dates are valid Date objects if provided
            if ((field === 'membershipStartDate' || field === 'membershipExpiryDate') && data[field]) {
                studentUpdateData[field] = new Date(data[field]);
            }
            else {
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
        }
        else if (checkDate >= new Date() && existingStudent.status === 'EXPIRED') {
            studentUpdateData.status = 'ACTIVE';
        }
    }
    return await database_1.prisma.$transaction(async (tx) => {
        const student = await tx.student.update({
            where: { id },
            data: studentUpdateData,
            include: { branch: { select: { name: true } } }
        });
        // Handle Payment Updates if provided
        if (existingStudent.payments[0]) {
            const lastPayment = existingStudent.payments[0];
            const paymentUpdate = {};
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
                }
                else {
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
        const { password: _, ...studentData } = student;
        return studentData;
    });
};
exports.updateStudent = updateStudent;
const activateStudent = async (id, branchId, data) => {
    const where = branchId ? { id, branchId } : { id };
    const student = await database_1.prisma.student.findFirstOrThrow({ where });
    if (student.status === 'ACTIVE')
        throw new Error('Student is already active');
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    const updated = await database_1.prisma.student.update({
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
exports.activateStudent = activateStudent;
const renewStudent = async (id, branchId, data) => {
    const where = branchId ? { id, branchId } : { id };
    return await database_1.prisma.$transaction(async (tx) => {
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
        const invoiceNumber = (0, generateId_1.generateInvoiceNumber)(branch.code, paymentCount + 1);
        await tx.payment.create({
            data: {
                invoiceNumber, studentId: student.id, branchId: student.branchId,
                amount, discount: data.discount || 0,
                totalAmount, paidAmount: totalAmount,
                pendingAmount: 0,
                paymentMode: data.paymentMode, paymentDate: new Date(),
                status: 'PAID', packageType: data.packageType, registrationType: 'RENEW'
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
exports.renewStudent = renewStudent;
const cancelStudent = async (id, branchId) => {
    const where = branchId ? { id, branchId } : { id };
    await database_1.prisma.student.findFirstOrThrow({ where });
    return await database_1.prisma.$transaction(async (tx) => {
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
exports.cancelStudent = cancelStudent;
const deleteStudent = async (id, branchId) => {
    const where = branchId ? { id, branchId } : { id };
    await database_1.prisma.student.findFirstOrThrow({ where });
    return await database_1.prisma.$transaction(async (tx) => {
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
exports.deleteStudent = deleteStudent;
const getStudentPayments = async (id, branchId, isStaff = false) => {
    const where = branchId ? { id, branchId } : { id };
    await database_1.prisma.student.findFirstOrThrow({ where });
    if (isStaff) {
        return await database_1.prisma.payment.findMany({
            where: { studentId: id },
            orderBy: { createdAt: 'desc' },
            select: { id: true, invoiceNumber: true, paymentMode: true, paymentDate: true, status: true, packageType: true, registrationType: true }
        });
    }
    return await database_1.prisma.payment.findMany({
        where: { studentId: id },
        orderBy: { createdAt: 'desc' },
        include: { installments: true }
    });
};
exports.getStudentPayments = getStudentPayments;
const getStudentAttendance = async (id, branchId) => {
    const where = branchId ? { id, branchId } : { id };
    await database_1.prisma.student.findFirstOrThrow({ where });
    return await database_1.prisma.attendanceRecord.findMany({
        where: { studentId: id },
        orderBy: { date: 'desc' },
        include: { scheduleSlot: true }
    });
};
exports.getStudentAttendance = getStudentAttendance;
const getStudentMembershipHistory = async (id, branchId) => {
    const where = branchId ? { id, branchId } : { id };
    await database_1.prisma.student.findFirstOrThrow({ where });
    return await database_1.prisma.membershipHistory.findMany({
        where: { studentId: id },
        orderBy: { createdAt: 'desc' },
    });
};
exports.getStudentMembershipHistory = getStudentMembershipHistory;
