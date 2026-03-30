"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelClassSchema = void 0;
const zod_1 = require("zod");
exports.cancelClassSchema = zod_1.z.object({
    body: zod_1.z.object({
        scheduleSlotId: zod_1.z.string().uuid()
    })
});
