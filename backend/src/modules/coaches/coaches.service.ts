import { prisma } from '../../config/database';
import { getPaginationOptions, formatPaginatedResponse } from '../../utils/pagination';
import { generateCoachId } from '../../utils/generateId';

export const getAllCoaches = async (branchId?: string, queryArgs?: any) => {
    const { page, limit, skip } = getPaginationOptions(queryArgs?.page, queryArgs?.limit);
    
    // Branch scoping
    const where = branchId ? { branchId, isActive: true } : { isActive: true };

    const [total, coaches] = await Promise.all([
        prisma.coach.count({ where }),
        prisma.coach.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { 
                branch: true,
                studentAssignments: {
                    include: { student: { select: { id: true, name: true, studentId: true, level: true } } }
                },
                _count: {
                    select: { studentAssignments: true }
                }
            }
        })
    ]);

    return formatPaginatedResponse(coaches, total, page, limit);
};

export const getCoachById = async (id: string, branchId?: string) => {
    const where = branchId ? { id, branchId } : { id };

    return await prisma.coach.findFirstOrThrow({
        where,
        include: {
            studentAssignments: {
                include: { student: { select: { id: true, name: true, level: true, status: true } } }
            }
        }
    });
};

export const createCoach = async (data: any, adminBranchId: string) => {
    // If branchId is not provided, default to the admin's branchId
    const branchId = data.branchId || adminBranchId;
    
    const branch = await prisma.branch.findUniqueOrThrow({ where: { id: branchId } });

    // Find the coach with the highest sequence number in this branch
    const lastCoach = await prisma.coach.findFirst({
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

    const coachId = generateCoachId(branch.code, nextSequence);

    return await prisma.coach.create({
        data: {
            ...data,
            branchId,
            coachId
        }
    });
};

export const updateCoach = async (id: string, branchId: string | undefined, data: any) => {
    const where = branchId ? { id, branchId } : { id };
    
    // Ensure coach exists and is accessible
    await prisma.coach.findFirstOrThrow({ where });

    return await prisma.coach.update({
        where: { id },
        data
    });
};

export const deleteCoach = async (id: string, branchId?: string) => {
    const where = branchId ? { id, branchId } : { id };
    await prisma.coach.findFirstOrThrow({ where });

    // Soft delete
    return await prisma.coach.update({
        where: { id },
        data: { isActive: false }
    });
};

export const assignStudents = async (coachId: string, branchId: string | undefined, studentIds: string[]) => {
    const where = branchId ? { id: coachId, branchId } : { id: coachId };
    await prisma.coach.findFirstOrThrow({ where });

    // Ensure all students belong to the same branch
    if (branchId) {
        const students = await prisma.student.findMany({
            where: { id: { in: studentIds } }
        });
        const invalidStudents = students.filter((s: any) => s.branchId !== branchId);
        if (invalidStudents.length > 0) throw new Error('Cannot assign students from another branch');
    }

    const assignments = studentIds.map(studentId => ({
        coachId,
        studentId
    }));

    // Use createMany to ignore duplicates gracefully if supported, 
    // otherwise do a loop with upsert. Prisma createMany supports skipDuplicates.
    await prisma.coachStudentAssignment.createMany({
        data: assignments,
        skipDuplicates: true
    });

    return { success: true };
};

export const unassignStudent = async (coachId: string, studentId: string, branchId?: string) => {
    const where = branchId ? { id: coachId, branchId } : { id: coachId };
    await prisma.coach.findFirstOrThrow({ where });

    await prisma.coachStudentAssignment.deleteMany({
        where: {
            coachId,
            studentId
        }
    });
};
