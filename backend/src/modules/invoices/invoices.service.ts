import { prisma } from '../../config/database';
import PDFDocument from 'pdfkit';
import { NotFoundError } from '../../utils/errors';

export const getInvoiceData = async (paymentId: string, branchId?: string) => {
    const where = branchId ? { id: paymentId, branchId } : { id: paymentId };
    const payment = await prisma.payment.findFirst({
        where,
        include: {
            student: { select: { name: true, phone: true, email: true, studentId: true, trn: true } },
            branch: { select: { name: true, trn: true, code: true, serialPrefix: true } },
            installments: true
        }
    });

    if (!payment) throw new NotFoundError('Payment/Invoice not found');

    // Fetch the membership history associated with this payment (matched by time proximity + package)
    const membershipHistory = await prisma.membershipHistory.findFirst({
        where: {
            studentId: payment.studentId,
            packageType: payment.packageType,
            createdAt: {
                gte: new Date(payment.createdAt.getTime() - 120000),
                lte: new Date(payment.createdAt.getTime() + 120000),
            }
        },
        select: {
            totalClasses: true,
            freeClasses: true,
            oldClasses: true,
            startDate: true,
            expiryDate: true,
        }
    });

    return {
        ...payment,
        classBreakdown: membershipHistory ? {
            newClasses: membershipHistory.totalClasses,
            oldClasses: membershipHistory.oldClasses || 0,
            freeClasses: membershipHistory.freeClasses || 0,
            totalClasses: membershipHistory.totalClasses + (membershipHistory.freeClasses || 0) + (membershipHistory.oldClasses || 0),
            startDate: membershipHistory.startDate,
            expiryDate: membershipHistory.expiryDate,
        } : null,
    };
};

export const createInvoicePdfStream = async (paymentId: string, branchId?: string) => {
    const payment = await getInvoiceData(paymentId, branchId);
    
    const doc = new PDFDocument({ margin: 50 });

    // Header
    doc
      .fontSize(20)
      .text('NSM Swimming Academy', { align: 'center' })
      .fontSize(12)
      .text(`Branch: ${payment.branch.name}`, { align: 'center' })
      .text(`Branch TRN: ${payment.branch.trn}`, { align: 'center' })
      .moveDown();

    // Invoice Meta
    doc
      .fontSize(16)
      .text('TAX INVOICE', { align: 'center', underline: true })
      .moveDown();

    doc.fontSize(12);
    const leftX = 50;
    const rightX = 350;
    let y = doc.y;

    doc.text(`Invoice No: ${payment.invoiceNumber}`, leftX, y);
    doc.text(`Date: ${payment.paymentDate.toISOString().split('T')[0]}`, rightX, y);
    y += 20;

    // Serial Number — prominently displayed
    if (payment.serialNumber) {
        doc.font('Helvetica-Bold');
        doc.text(`Serial No: ${payment.serialNumber}`, leftX, y);
        doc.font('Helvetica');
        doc.text(`Type: ${payment.registrationType === 'RENEW' ? 'RENEWAL' : 'NEW REGISTRATION'}`, rightX, y);
        y += 20;
    }

    doc.text(`Student: ${payment.student?.name || 'Unknown'}`, leftX, y);
    doc.text(`Student ID: ${payment.student?.studentId || 'N/A'}`, rightX, y);
    y += 20;

    if (payment.student?.trn) {
        doc.text(`Student TRN: ${payment.student.trn}`, leftX, y);
        y += 20;
    }

    doc.text(`Registration Type: ${payment.registrationType}`, leftX, y);
    doc.text(`Package: ${payment.packageType}`, rightX, y);
    y += 30;

    // Line items
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 10;
    
    doc.text('Description', 50, y);
    doc.text('Amount (AED)', 400, y, { width: 150, align: 'right' });
    y += 20;

    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 10;

    doc.text(`Swimming Package - ${payment.packageType}`, 50, y);
    doc.text(payment.amount.toFixed(2), 400, y, { width: 150, align: 'right' });
    y += 20;

    if (payment.discount > 0) {
        doc.text('Discount', 50, y);
        doc.text(`-${payment.discount.toFixed(2)}`, 400, y, { width: 150, align: 'right' });
        y += 20;
    }

    // Class Breakdown Section
    if (payment.classBreakdown) {
        y += 10;
        doc.moveTo(50, y).lineTo(550, y).stroke();
        y += 10;
        
        doc.font('Helvetica-Bold');
        doc.text('CLASS BREAKDOWN', 50, y);
        y += 18;
        doc.font('Helvetica');

        doc.text(`New Package Classes:`, 70, y);
        doc.text(`${payment.classBreakdown.newClasses}`, 400, y, { width: 150, align: 'right' });
        y += 16;

        if (payment.classBreakdown.oldClasses > 0) {
            doc.text(`Old Rollover Classes:`, 70, y);
            doc.text(`+ ${payment.classBreakdown.oldClasses}`, 400, y, { width: 150, align: 'right' });
            y += 16;
        }

        if (payment.classBreakdown.freeClasses > 0) {
            doc.text(`Free/Promotional Classes:`, 70, y);
            doc.text(`+ ${payment.classBreakdown.freeClasses}`, 400, y, { width: 150, align: 'right' });
            y += 16;
        }

        doc.font('Helvetica-Bold');
        doc.text(`Total Classes:`, 70, y);
        doc.text(`${payment.classBreakdown.totalClasses}`, 400, y, { width: 150, align: 'right' });
        y += 16;
        doc.font('Helvetica');

        if (payment.classBreakdown.startDate && payment.classBreakdown.expiryDate) {
            y += 4;
            doc.fontSize(10);
            doc.text(`Valid: ${new Date(payment.classBreakdown.startDate).toLocaleDateString()} — ${new Date(payment.classBreakdown.expiryDate).toLocaleDateString()}`, 70, y);
            doc.fontSize(12);
            y += 16;
        }
    }

    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 10;

    doc.font('Helvetica-Bold');
    doc.text('Total Amount', 50, y);
    doc.text(payment.totalAmount.toFixed(2), 400, y, { width: 150, align: 'right' });
    y += 20;

    doc.text(`Paid Amount (${payment.paymentMode})`, 50, y);
    doc.text(payment.paidAmount.toFixed(2), 400, y, { width: 150, align: 'right' });
    y += 20;

    if (payment.pendingAmount > 0) {
        doc.text('Pending Amount', 50, y);
        doc.text(payment.pendingAmount.toFixed(2), 400, y, { width: 150, align: 'right' });
        y += 20;
    }

    doc.font('Helvetica');
    y += 30;
    doc.text('Thank you for choosing NSM Swimming Academy.', 50, y, { align: 'center' });

    return { doc, filename: `Invoice_${payment.invoiceNumber}.pdf` };
};
