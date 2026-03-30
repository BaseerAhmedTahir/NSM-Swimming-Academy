"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvoicePdfStream = exports.getInvoiceData = void 0;
const database_1 = require("../../config/database");
const pdfkit_1 = __importDefault(require("pdfkit"));
const errors_1 = require("../../utils/errors");
const getInvoiceData = async (paymentId, branchId) => {
    const where = branchId ? { id: paymentId, branchId } : { id: paymentId };
    const payment = await database_1.prisma.payment.findFirst({
        where,
        include: {
            student: { select: { name: true, phone: true, email: true, studentId: true, trn: true } },
            branch: { select: { name: true, trn: true, code: true } },
            installments: true
        }
    });
    if (!payment)
        throw new errors_1.NotFoundError('Payment/Invoice not found');
    return payment;
};
exports.getInvoiceData = getInvoiceData;
const createInvoicePdfStream = async (paymentId, branchId) => {
    const payment = await (0, exports.getInvoiceData)(paymentId, branchId);
    const doc = new pdfkit_1.default({ margin: 50 });
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
exports.createInvoicePdfStream = createInvoicePdfStream;
