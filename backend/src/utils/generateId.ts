/**
 * Generates an Invoice Number: INV-{branchCode}-{year}-{sequence}
 * Example: INV-DXB-2026-0001
 */
export const generateInvoiceNumber = (branchCode: string, sequence: number): string => {
    const year = new Date().getFullYear();
    const paddedSeq = sequence.toString().padStart(4, '0');
    return `INV-${branchCode.toUpperCase()}-${year}-${paddedSeq}`;
};

/**
 * Generates a Student ID: NSM-{branchCode}-{sequence}
 * Example: NSM-DXB-001
 */
export const generateStudentId = (branchCode: string, sequence: number): string => {
    const paddedSeq = sequence.toString().padStart(3, '0');
    return `NSM-${branchCode.toUpperCase()}-${paddedSeq}`;
};

/**
 * Generates a Coach ID: COACH-{branchCode}-{sequence}
 */
export const generateCoachId = (branchCode: string, sequence: number): string => {
    const paddedSeq = sequence.toString().padStart(3, '0');
    return `COACH-${branchCode.toUpperCase()}-${paddedSeq}`;
};
