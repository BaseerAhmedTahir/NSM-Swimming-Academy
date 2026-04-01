"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapSlot = exports.removeSlot = exports.assignSlot = exports.getScheduleGrid = void 0;
const database_1 = require("../../config/database");
const errors_1 = require("../../utils/errors");
const getScheduleGrid = async (dateStr, branchId) => {
    const targetDate = new Date(dateStr);
    targetDate.setUTCHours(0, 0, 0, 0);
    const coaches = await database_1.prisma.coach.findMany({
        where: { branchId, isActive: true },
        select: { id: true, name: true }
    });
    const schedules = await database_1.prisma.schedule.findMany({
        where: { branchId, date: targetDate },
        include: {
            slots: {
                include: {
                    student: { select: { id: true, name: true, level: true, status: true } },
                    attendanceRecord: { select: { id: true, status: true } }
                }
            }
        }
    });
    return { coaches, schedules };
};
exports.getScheduleGrid = getScheduleGrid;
const assignSlot = async (data, branchId) => {
    const targetDate = new Date(data.date);
    targetDate.setUTCHours(0, 0, 0, 0);
    return await database_1.prisma.$transaction(async (tx) => {
        // Ensure student belongs to this branch and is active
        const student = await tx.student.findFirst({
            where: { id: data.studentId, branchId }
        });
        if (!student || student.status !== 'ACTIVE') {
            throw new errors_1.ConflictError('Student not found or not active in this branch');
        }
        // Find or create schedule block for this coach on this date
        let schedule = await tx.schedule.findUnique({
            where: { date_branchId_coachId: { date: targetDate, branchId, coachId: data.coachId } }
        });
        if (!schedule) {
            schedule = await tx.schedule.create({
                data: { date: targetDate, branchId, coachId: data.coachId }
            });
        }
        // Check if student is already assigned to this time slot on this date (across ANY coach)
        const duplicateAssignment = await tx.scheduleSlot.findFirst({
            where: {
                timeSlot: data.timeSlot,
                studentId: data.studentId,
                schedule: {
                    date: targetDate,
                    branchId
                }
            },
            include: {
                schedule: {
                    include: { coach: { select: { name: true } } }
                }
            }
        });
        if (duplicateAssignment) {
            throw new errors_1.ConflictError(`Student is already scheduled at ${data.timeSlot} with ${duplicateAssignment.schedule.coach.name}`);
        }
        // Check if slot position is taken
        const existingSlot = await tx.scheduleSlot.findUnique({
            where: { scheduleId_timeSlot_slotPosition: { scheduleId: schedule.id, timeSlot: data.timeSlot, slotPosition: data.slotPosition } }
        });
        if (existingSlot && existingSlot.studentId) {
            throw new errors_1.ConflictError('Slot is already occupied');
        }
        if (existingSlot) {
            await tx.scheduleSlot.update({
                where: { id: existingSlot.id },
                data: { studentId: data.studentId }
            });
        }
        else {
            await tx.scheduleSlot.create({
                data: {
                    scheduleId: schedule.id,
                    timeSlot: data.timeSlot,
                    slotPosition: data.slotPosition,
                    studentId: data.studentId
                }
            });
        }
        if (data.studentId && data.coachId) {
            await tx.coachStudentAssignment.createMany({
                data: [{ coachId: data.coachId, studentId: data.studentId }],
                skipDuplicates: true
            });
        }
        return true;
    });
};
exports.assignSlot = assignSlot;
const removeSlot = async (data, branchId) => {
    const targetDate = new Date(data.date);
    targetDate.setUTCHours(0, 0, 0, 0);
    const schedule = await database_1.prisma.schedule.findUnique({
        where: { date_branchId_coachId: { date: targetDate, branchId, coachId: data.coachId } }
    });
    if (!schedule)
        throw new errors_1.NotFoundError('Schedule not found');
    const slot = await database_1.prisma.scheduleSlot.findUnique({
        where: { scheduleId_timeSlot_slotPosition: { scheduleId: schedule.id, timeSlot: data.timeSlot, slotPosition: data.slotPosition } }
    });
    if (!slot)
        throw new errors_1.NotFoundError('Slot not found');
    return await database_1.prisma.scheduleSlot.update({
        where: { id: slot.id },
        data: { studentId: null }
    });
};
exports.removeSlot = removeSlot;
const swapSlot = async (data, branchId) => {
    // Basic implementation of swap. Could involve 2 different schedules (different coaches) on same date
    const targetDate = new Date(data.date);
    targetDate.setUTCHours(0, 0, 0, 0);
    return await database_1.prisma.$transaction(async (tx) => {
        // Find Schedules
        let schedule1 = await tx.schedule.findUnique({ where: { date_branchId_coachId: { date: targetDate, branchId, coachId: data.fromCoachId } } });
        let schedule2 = await tx.schedule.findUnique({ where: { date_branchId_coachId: { date: targetDate, branchId, coachId: data.toCoachId } } });
        if (!schedule1)
            throw new errors_1.NotFoundError('Source schedule not found');
        if (!schedule2) {
            // Target coach has no schedule block yet, create it
            schedule2 = await tx.schedule.create({ data: { date: targetDate, branchId, coachId: data.toCoachId } });
        }
        const slot1 = await tx.scheduleSlot.findUnique({
            where: { scheduleId_timeSlot_slotPosition: { scheduleId: schedule1.id, timeSlot: data.fromTimeSlot, slotPosition: data.fromSlotPosition } }
        });
        const slot2 = await tx.scheduleSlot.findUnique({
            where: { scheduleId_timeSlot_slotPosition: { scheduleId: schedule2.id, timeSlot: data.toTimeSlot, slotPosition: data.toSlotPosition } }
        });
        const studentId1 = slot1?.studentId || null;
        const studentId2 = slot2?.studentId || null;
        // Upsert Slot 1 with Student 2
        if (slot1) {
            await tx.scheduleSlot.update({ where: { id: slot1.id }, data: { studentId: studentId2 } });
        }
        else if (studentId2) {
            await tx.scheduleSlot.create({ data: { scheduleId: schedule1.id, timeSlot: data.fromTimeSlot, slotPosition: data.fromSlotPosition, studentId: studentId2 } });
        }
        // Upsert Slot 2 with Student 1
        if (slot2) {
            await tx.scheduleSlot.update({ where: { id: slot2.id }, data: { studentId: studentId1 } });
        }
        else if (studentId1) {
            await tx.scheduleSlot.create({ data: { scheduleId: schedule2.id, timeSlot: data.toTimeSlot, slotPosition: data.toSlotPosition, studentId: studentId1 } });
        }
        // Auto assign to coaches
        if (studentId2) {
            await tx.coachStudentAssignment.createMany({
                data: [{ coachId: data.fromCoachId, studentId: studentId2 }],
                skipDuplicates: true
            });
        }
        if (studentId1) {
            await tx.coachStudentAssignment.createMany({
                data: [{ coachId: data.toCoachId, studentId: studentId1 }],
                skipDuplicates: true
            });
        }
    });
};
exports.swapSlot = swapSlot;
