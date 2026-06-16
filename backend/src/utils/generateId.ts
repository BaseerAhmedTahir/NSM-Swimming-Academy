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

/**
 * Generates a Transactional Serial Number: {branchPrefix}-{YYMM}-{sequence}
 * Example: S01-2606-0001 (Sharjah, June 2026, first transaction)
 * 
 * branchPrefix comes from Branch.serialPrefix (e.g. "S01", "D01", "AB01")
 * Falls back to branch code if no prefix is configured.
 */
export const generateSerialNumber = (branchPrefix: string, sequence: number): string => {
    const now = new Date();
    const yy = now.getFullYear().toString().slice(-2);
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const paddedSeq = sequence.toString().padStart(4, '0');
    return `${branchPrefix.toUpperCase()}-${yy}${mm}-${paddedSeq}`;
};
