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
    }

    // Auto-fit columns
    sheet.columns.forEach(column => {
        column.width = 20;
    });

    return workbook;
};
