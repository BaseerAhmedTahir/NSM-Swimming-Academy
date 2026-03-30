"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unassignStudent = exports.assignStudents = exports.deleteCoach = exports.updateCoach = exports.createCoach = exports.getCoachById = exports.getAllCoaches = void 0;
const database_1 = require("../../config/database");
const pagination_1 = require("../../utils/pagination");
const generateId_1 = require("../../utils/generateId");
const getAllCoaches = async (branchId, queryArgs) => {
    const { page, limit, skip } = (0, pagination_1.getPaginationOptions)(queryArgs?.page, queryArgs?.limit);
    // Branch scoping
    const where = branchId ? { branchId, isActive: true } : { isActive: true };
    const [total, coaches] = await Promise.all([
        database_1.prisma.coach.count({ where }),
        database_1.prisma.coach.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                branch: true,
                _count: {
                    select: { studentAssignments: true }
                }
            }
        })
    ]);
    return (0, pagination_1.formatPaginatedResponse)(coaches, total, page, limit);
};
exports.getAllCoaches = getAllCoaches;
const getCoachById = async (id, branchId) => {
    const where = branchId ? { id, branchId } : { id };
    return await database_1.prisma.coach.findFirstOrThrow({
        where,
        include: {
            studentAssignments: {
                include: { student: { select: { id: true, name: true, level: true, status: true } } }
            }
        }
    });
};
exports.getCoachById = getCoachById;
const createCoach = async (data, adminBranchId) => {
    // If branchId is not provided, default to the admin's branchId
    const branchId = data.branchId || adminBranchId;
    const branch = await database_1.prisma.branch.findUniqueOrThrow({ where: { id: branchId } });
    // Find the coach with the highest sequence number in this branch
    const lastCoach = await database_1.prisma.coach.findFirst({
        where: { branchId },
        orderBy: { createdAt: 'desc' },
        select: { coachId: true }
    });
    let nextSequence = 1;
    if (lastCoach && lastCoach.coachId) {
        const parts = lastCoach.coachId.split('-');
        const lastSeq = parseInt(parts[parts.length - 1]);
        if (!isNaN(lastSeq)) {
            nextSequence = lastSeq + 1;
        }
    }
    const coachId = (0, generateId_1.generateCoachId)(branch.code, nextSequence);
    return await database_1.prisma.coach.create({
        data: {
            ...data,
            branchId,
            coachId
        }
    });
};
exports.createCoach = createCoach;
const updateCoach = async (id, branchId, data) => {
    const where = branchId ? { id, branchId } : { id };
    // Ensure coach exists and is accessible
    await database_1.prisma.coach.findFirstOrThrow({ where });
    return await database_1.prisma.coach.update({
        where: { id },
        data
    });
};
exports.updateCoach = updateCoach;
const deleteCoach = async (id, branchId) => {
    const where = branchId ? { id, branchId } : { id };
    await database_1.prisma.coach.findFirstOrThrow({ where });
    // Soft delete
    return await database_1.prisma.coach.update({
        where: { id },
        data: { isActive: false }
    });
};
exports.deleteCoach = deleteCoach;
const assignStudents = async (coachId, branchId, studentIds) => {
    const where = branchId ? { id: coachId, branchId } : { id: coachId };
    await database_1.prisma.coach.findFirstOrThrow({ where });
    // Ensure all students belong to the same branch
    if (branchId) {
        const students = await database_1.prisma.student.findMany({
            where: { id: { in: studentIds } }
        });
        const invalidStudents = students.filter((s) => s.branchId !== branchId);
        if (invalidStudents.length > 0)
            throw new Error('Cannot assign students from another branch');
    }
    const assignments = studentIds.map(studentId => ({
        coachId,
        studentId
    }));
    // Use createMany to ignore duplicates gracefully if supported, 
    // otherwise do a loop with upsert. Prisma createMany supports skipDuplicates.
    await database_1.prisma.coachStudentAssignment.createMany({
        data: assignments,
        skipDuplicates: true
    });
    return { success: true };
};
exports.assignStudents = assignStudents;
const unassignStudent = async (coachId, studentId, branchId) => {
    const where = branchId ? { id: coachId, branchId } : { id: coachId };
    await database_1.prisma.coach.findFirstOrThrow({ where });
    await database_1.prisma.coachStudentAssignment.deleteMany({
        where: {
            coachId,
            studentId
        }
    });
};
exports.unassignStudent = unassignStudent;
