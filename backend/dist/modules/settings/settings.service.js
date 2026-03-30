"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSettingsBulk = exports.getSettingsByCategory = void 0;
const database_1 = require("../../config/database");
const getSettingsByCategory = async (category) => {
    // Schema doesn't have an explicit category field, so we just return all settings or we could filter by key prefix if we wanted to.
    return await database_1.prisma.setting.findMany();
};
exports.getSettingsByCategory = getSettingsByCategory;
const saveSettingsBulk = async (settingsArray) => {
    // Upsert each setting
    const results = [];
    for (const s of settingsArray) {
        const record = await database_1.prisma.setting.upsert({
            where: { key: s.key },
            update: { value: s.value, description: s.category || undefined },
            create: { key: s.key, value: s.value, description: s.category || undefined }
        });
        results.push(record);
    }
    return results;
};
exports.saveSettingsBulk = saveSettingsBulk;
