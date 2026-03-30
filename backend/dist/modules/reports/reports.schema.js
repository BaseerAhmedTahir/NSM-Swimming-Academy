"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportsSchema = void 0;
const zod_1 = require("zod");
exports.getReportsSchema = zod_1.z.object({
    query: zod_1.z.object({
        branchId: zod_1.z.string().uuid().optional(),
        month: zod_1.z.string().regex(/^(1[0-2]|[1-9])$/).optional(),
        year: zod_1.z.string().regex(/^\d{4}$/).optional(),
        format: zod_1.z.enum(['JSON', 'PDF']).default('JSON')
    })
});
