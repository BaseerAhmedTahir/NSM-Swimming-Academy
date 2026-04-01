"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttendance = exports.markAttendance = exports.getAttendanceByDate = void 0;
const database_1 = require("../../config/database");
const errors_1 = require("../../utils/errors");
const email_1 = require("../../utils/email");
const getAttendanceByDate = async (dateStr, branchId) => {
    const targetDate = new Date(dateStr);
    targetDate.setUTCHours(0, 0, 0, 0);
    return await database_1.prisma.attendanceRecord.findMany({
        where: {
            date: targetDate,
            ...(branchId ? { student: { branchId } } : {})
        },
        include: {
            student: { select: { id: true, name: true, studentId: true } },
            scheduleSlot: { select: { timeSlot: true, schedule: { select: { coach: { select: { name: true } } } } } }
        }
    });
};
exports.getAttendanceByDate = getAttendanceByDate;
const markAttendance = async (data, branchId, markedBy) => {
    const targetDate = new Date(data.date);
    targetDate.setUTCHours(0, 0, 0, 0);
    // Verify slot and student belong to branch
    const slot = await database_1.prisma.scheduleSlot.findFirst({
        where: { id: data.scheduleSlotId, studentId: data.studentId, schedule: { branchId } }
    });
    if (!slot)
        throw new errors_1.NotFoundError('Schedule slot not found or student not assigned to this slot');
    const existingRecord = await database_1.prisma.attendanceRecord.findUnique({
        where: { scheduleSlotId: data.scheduleSlotId }
    });
    if (existingRecord) {
        throw new errors_1.ConflictError('Attendance already marked for this slot. Use update instead.');
    }
    return await database_1.prisma.$transaction(async (tx) => {
        const record = await tx.attendanceRecord.create({
            data: {
                scheduleSlotId: data.scheduleSlotId,
                studentId: data.studentId,
                date: targetDate,
                status: data.status,
                comment: data.comment,
                markedBy
            }
        });
        if (data.status === 'ATTENDED') {
            const history = await tx.membershipHistory.findFirst({
                where: { studentId: data.studentId, status: 'ACTIVE' },
                orderBy: { createdAt: 'desc' }
            });
            if (history) {
                await tx.membershipHistory.update({
                    where: { id: history.id },
                    data: { classesUsed: { increment: 1 } }
                });
            }
        }
        // Logic for generating notification or email (Phase 6 Email Service)
        if (data.status === 'ABSENT' || data.status === 'INFORMED') {
            // Create notification
            await tx.notification.create({
                data: {
                    branchId,
                    title: 'Class Missed',
                    message: `Your attendance was marked as ${data.status} for ${targetDate.toDateString()}`,
                    type: 'MISSED_CLASS',
                    sentTo: 'INDIVIDUAL',
                    targetId: data.studentId
                }
            });
            // Send Email Notification
            const studentInfo = await tx.student.findUnique({ where: { id: data.studentId }, select: { email: true, name: true } });
            if (studentInfo && studentInfo.email) {
                (0, email_1.sendMissedClassEmail)(studentInfo.email, studentInfo.name, targetDate.toDateString()).catch(console.error);
            }
        }
        return record;
    });
};
exports.markAttendance = markAttendance;
const updateAttendance = async (id, branchId, data, updatedBy) => {
    const existing = await database_1.prisma.attendanceRecord.findFirstOrThrow({
        where: { id, ...(branchId ? { student: { branchId } } : {}) },
        include: { scheduleSlot: true }
    });
    // If changing from ABSENT->ATTENDED or ATTENDED->ABSENT we'd need to adjust classesUsed. 
    // This assumes simple increment/decrement on MembershipHistory.
    return await database_1.prisma.$transaction(async (tx) => {
        const record = await tx.attendanceRecord.update({
            where: { id },
            data: {
                status: data.status,
                comment: data.comment,
                markedBy: updatedBy
            }
        });
        if (existing.status !== data.status) {
            const history = await tx.membershipHistory.findFirst({
                where: { studentId: existing.studentId, status: 'ACTIVE' },
                orderBy: { createdAt: 'desc' }
            });
            if (history) {
                if (existing.status === 'ATTENDED' && data.status !== 'ATTENDED') {
                    // Decrement used classes
                    await tx.membershipHistory.update({
                        where: { id: history.id },
                        data: { classesUsed: { decrement: 1 } }
                    });
                }
                else if (existing.status !== 'ATTENDED' && data.status === 'ATTENDED') {
                    // Increment used classes
                    await tx.membershipHistory.update({
                        where: { id: history.id },
                        data: { classesUsed: { increment: 1 } }
                    });
                }
            }
        }
        return record;
    });
};
exports.updateAttendance = updateAttendance;
