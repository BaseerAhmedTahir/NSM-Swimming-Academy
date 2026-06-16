import { prisma } from '../../config/database';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

/* Reports Service */
// Generates broad reporting data aggregated across modules.

export const generateReportData = async (type: string, queryArgs: any) => {
    const whereBranch = queryArgs.branchId ? { branchId: queryArgs.branchId } : {};

    let startDate: Date, endDate: Date;
    if (queryArgs.month && queryArgs.year) {
        startDate = new Date(parseInt(queryArgs.year), parseInt(queryArgs.month) - 1, 1);
        endDate = new Date(parseInt(queryArgs.year), parseInt(queryArgs.month), 0, 23, 59, 59);
    } else if (queryArgs.duration === 'today') {
        startDate = new Date(); startDate.setHours(0,0,0,0);
        endDate = new Date(); endDate.setHours(23,59,59,999);
    } else if (queryArgs.duration === 'this-week') {
        const today = new Date();
        const first = today.getDate() - today.getDay();
        startDate = new Date(today.setDate(first)); startDate.setHours(0,0,0,0);
        endDate = new Date(today.setDate(first + 7)); endDate.setHours(23,59,59,999);
    } else if (queryArgs.duration === 'this-month') {
        const today = new Date();
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (queryArgs.duration === 'this-year') {
        const today = new Date();
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else {
        startDate = new Date(new Date().getFullYear(), 0, 1);
        endDate = new Date();
    }

    if (type === 'revenue') {
        const payments = await prisma.payment.findMany({
            where: { ...whereBranch, paymentDate: { gte: startDate, lte: endDate } },
            select: { amount: true, paidAmount: true, pendingAmount: true, status: true, branch: { select: { name: true } } }
        });

        const stats = {
            totalAmount: payments.reduce((sum: number, p: any) => sum + p.amount, 0),
            totalPaid: payments.reduce((sum: number, p: any) => sum + p.paidAmount, 0),
            totalPending: payments.reduce((sum: number, p: any) => sum + p.pendingAmount, 0),
            count: payments.length
        };
        return { type: 'revenue', startDate, endDate, stats, data: payments };
    }

    if (type === 'attendance') {
        const records = await prisma.attendanceRecord.groupBy({
            by: ['status'],
            where: { date: { gte: startDate, lte: endDate }, scheduleSlot: { schedule: { ...whereBranch } } },
            _count: true
        });

        // Get total classes vs missed
        return { type: 'attendance', startDate, endDate, summary: records };
    }

    if (type === 'students') {
        const [statusBreakdown, levelBreakdown, total] = await Promise.all([
            prisma.student.groupBy({
                by: ['status'],
                where: { ...whereBranch, createdAt: { gte: startDate, lte: endDate } },
                _count: true
            }),
            prisma.student.groupBy({
                by: ['level'],
                where: { ...whereBranch, createdAt: { gte: startDate, lte: endDate } },
                _count: true
            }),
            prisma.student.count({ where: { ...whereBranch, createdAt: { gte: startDate, lte: endDate } } })
        ]);
        
        return { type: 'students', startDate, endDate, total, breakdown: statusBreakdown, levels: levelBreakdown };
    }

    if (type === 'registrations') {
        // New vs Renewal breakdown from payments
        const [regTypeBreakdown, branchBreakdown, totalTransactions] = await Promise.all([
            prisma.payment.groupBy({
                by: ['registrationType'],
                where: { ...whereBranch, paymentDate: { gte: startDate, lte: endDate } },
                _count: true,
                _sum: { paidAmount: true }
            }),
            prisma.payment.groupBy({
                by: ['registrationType', 'branchId'],
                where: { paymentDate: { gte: startDate, lte: endDate } },
                _count: true,
                _sum: { paidAmount: true }
            }),
            prisma.payment.count({
                where: { ...whereBranch, paymentDate: { gte: startDate, lte: endDate } }
            })
        ]);

        // Resolve branch names for the breakdown
        const branchIds = [...new Set(branchBreakdown.map((b: any) => b.branchId))];
        const branches = branchIds.length > 0
            ? await prisma.branch.findMany({
                where: { id: { in: branchIds as string[] } },
                select: { id: true, name: true, serialPrefix: true, code: true }
            })
            : [];
        const branchMap = Object.fromEntries(branches.map((b: any) => [b.id, b]));

        const newCount = regTypeBreakdown.find((r: any) => r.registrationType === 'NEW')?._count || 0;
        const renewCount = regTypeBreakdown.find((r: any) => r.registrationType === 'RENEW')?._count || 0;
        const newRevenue = regTypeBreakdown.find((r: any) => r.registrationType === 'NEW')?._sum?.paidAmount || 0;
        const renewRevenue = regTypeBreakdown.find((r: any) => r.registrationType === 'RENEW')?._sum?.paidAmount || 0;

        // Format branch-wise breakdown
        const branchWise = branchBreakdown.map((b: any) => ({
            branchId: b.branchId,
            branchName: branchMap[b.branchId]?.name || 'Unknown',
            branchPrefix: branchMap[b.branchId]?.serialPrefix || branchMap[b.branchId]?.code || 'N/A',
            registrationType: b.registrationType,
            count: b._count,
            revenue: b._sum?.paidAmount || 0
        }));

        // Get serial number ranges per branch for the period
        const serialRanges = await prisma.payment.findMany({
            where: { ...whereBranch, paymentDate: { gte: startDate, lte: endDate }, serialNumber: { not: null } },
            select: { serialNumber: true, branchId: true, registrationType: true },
            orderBy: { serialNumber: 'asc' }
        });

        return {
            type: 'registrations',
            startDate,
            endDate,
            summary: {
                newRegistrations: newCount,
                renewals: renewCount,
                total: totalTransactions,
                newRevenue,
                renewRevenue,
                totalRevenue: newRevenue + renewRevenue,
            },
            branchWise,
            serialRanges
        };
    }

    throw new Error('Invalid report type or not implemented');
};

export const createPdfReportStream = async (type: string, data: any) => {
    const doc = new PDFDocument({ margin: 50 });

    doc.fontSize(20).text(`NSM Report: ${type.toUpperCase()}`, { align: 'center' }).moveDown();
    doc.fontSize(12).text(`Period: ${data.startDate.toDateString()} - ${data.endDate.toDateString()}`).moveDown();

    if (type === 'revenue') {
        doc.text(`Total Generated: AED ${data.stats.totalAmount.toFixed(2)}`);
        doc.text(`Total Collected: AED ${data.stats.totalPaid.toFixed(2)}`);
        doc.text(`Total Outstanding: AED ${data.stats.totalPending.toFixed(2)}`);
        doc.text(`Transaction Count: ${data.stats.count}`);
    } else if (type === 'attendance') {
        doc.text('Attendance Breakdown:');
        data.summary.forEach((stat: any) => {
            doc.text(`- ${stat.status}: ${stat._count}`);
        });
    } else if (type === 'students') {
        doc.text(`Total New Students: ${data.total}`);
        doc.text('Status Breakdown:');
        data.breakdown.forEach((stat: any) => {
            doc.text(`- ${stat.status}: ${stat._count}`);
        });
    } else if (type === 'registrations') {
        doc.font('Helvetica-Bold').text('Registration Summary').font('Helvetica').moveDown(0.5);
        doc.text(`New Registrations: ${data.summary.newRegistrations}`);
        doc.text(`Renewals: ${data.summary.renewals}`);
        doc.text(`Total Transactions: ${data.summary.total}`);
        doc.moveDown(0.5);
        doc.text(`New Revenue: AED ${data.summary.newRevenue.toFixed(2)}`);
        doc.text(`Renewal Revenue: AED ${data.summary.renewRevenue.toFixed(2)}`);
        doc.text(`Total Revenue: AED ${data.summary.totalRevenue.toFixed(2)}`);
        
        if (data.branchWise && data.branchWise.length > 0) {
            doc.moveDown().font('Helvetica-Bold').text('Branch-wise Breakdown:').font('Helvetica').moveDown(0.5);
            // Group by branch
            const grouped: Record<string, any[]> = {};
            data.branchWise.forEach((b: any) => {
                if (!grouped[b.branchName]) grouped[b.branchName] = [];
                grouped[b.branchName].push(b);
            });
            Object.entries(grouped).forEach(([name, items]: [string, any[]]) => {
                doc.text(`${name} (${items[0]?.branchPrefix || 'N/A'}):`);
                items.forEach((item: any) => {
                    doc.text(`  ${item.registrationType}: ${item.count} transactions — AED ${item.revenue.toFixed(2)}`);
                });
            });
        }
    }

    doc.moveDown(2).font('Helvetica-Oblique').text('End of Report', { align: 'center' });
    
    return doc;
};

export const createExcelReport = async (type: string, data: any) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`${type.toUpperCase()} Report`);
    
    sheet.addRow(['Report Period:', `${data.startDate.toDateString()} - ${data.endDate.toDateString()}`]);
    sheet.addRow([]);

    if (type === 'revenue') {
        sheet.addRow(['Total Generated', `AED ${data.stats.totalAmount.toFixed(2)}`]);
        sheet.addRow(['Total Collected', `AED ${data.stats.totalPaid.toFixed(2)}`]);
        sheet.addRow(['Total Outstanding', `AED ${data.stats.totalPending.toFixed(2)}`]);
        sheet.addRow(['Transaction Count', data.stats.count]);
        sheet.addRow([]);
        sheet.addRow(['Amount', 'Paid Amount', 'Pending Amount', 'Status', 'Branch']);
        data.data.forEach((p: any) => {
            sheet.addRow([p.amount, p.paidAmount, p.pendingAmount, p.status, p.branch.name]);
        });
    } else if (type === 'attendance') {
        sheet.addRow(['Status', 'Count']);
        data.summary.forEach((stat: any) => {
            sheet.addRow([stat.status, stat._count]);
        });
    } else if (type === 'students') {
        sheet.addRow(['Total New Students:', data.total]);
        sheet.addRow([]);
        sheet.addRow(['Status', 'Count']);
        data.breakdown.forEach((stat: any) => {
            sheet.addRow([stat.status, stat._count]);
        });
    } else if (type === 'registrations') {
        sheet.addRow(['REGISTRATION METRICS']);
        sheet.addRow([]);
        sheet.addRow(['New Registrations', data.summary.newRegistrations]);
        sheet.addRow(['Renewals', data.summary.renewals]);
        sheet.addRow(['Total Transactions', data.summary.total]);
        sheet.addRow([]);
        sheet.addRow(['New Revenue (AED)', data.summary.newRevenue]);
        sheet.addRow(['Renewal Revenue (AED)', data.summary.renewRevenue]);
        sheet.addRow(['Total Revenue (AED)', data.summary.totalRevenue]);
        sheet.addRow([]);
        sheet.addRow(['BRANCH-WISE BREAKDOWN']);
        sheet.addRow(['Branch', 'Prefix', 'Type', 'Count', 'Revenue (AED)']);
        if (data.branchWise) {
            data.branchWise.forEach((b: any) => {
                sheet.addRow([b.branchName, b.branchPrefix, b.registrationType, b.count, b.revenue]);
            });
        }
    }

    // Auto-fit columns
    sheet.columns.forEach(column => {
        column.width = 20;
    });

    return workbook;
};
