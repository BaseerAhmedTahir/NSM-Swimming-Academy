"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSettingsSchema = void 0;
const zod_1 = require("zod");
exports.saveSettingsSchema = zod_1.z.object({
    body: zod_1.z.object({
        settings: zod_1.z.array(zod_1.z.object({
            key: zod_1.z.string().min(1),
            value: zod_1.z.string().min(1),
            category: zod_1.z.string().optional()
        }))
    })
});
