"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCoachId = exports.generateStudentId = exports.generateInvoiceNumber = void 0;
/**
 * Generates an Invoice Number: INV-{branchCode}-{year}-{sequence}
 * Example: INV-DXB-2026-0001
 */
const generateInvoiceNumber = (branchCode, sequence) => {
    const year = new Date().getFullYear();
    const paddedSeq = sequence.toString().padStart(4, '0');
    return `INV-${branchCode.toUpperCase()}-${year}-${paddedSeq}`;
};
exports.generateInvoiceNumber = generateInvoiceNumber;
/**
 * Generates a Student ID: NSM-{branchCode}-{sequence}
 * Example: NSM-DXB-001
 */
const generateStudentId = (branchCode, sequence) => {
    const paddedSeq = sequence.toString().padStart(3, '0');
    return `NSM-${branchCode.toUpperCase()}-${paddedSeq}`;
};
exports.generateStudentId = generateStudentId;
/**
 * Generates a Coach ID: COACH-{branchCode}-{sequence}
 */
const generateCoachId = (branchCode, sequence) => {
    const paddedSeq = sequence.toString().padStart(3, '0');
    return `COACH-${branchCode.toUpperCase()}-${paddedSeq}`;
};
exports.generateCoachId = generateCoachId;
