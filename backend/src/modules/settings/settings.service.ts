import { prisma } from '../../config/database';

export const getSettingsByCategory = async (category?: string) => {
    // Schema doesn't have an explicit category field, so we just return all settings or we could filter by key prefix if we wanted to.
    return await prisma.setting.findMany();
};

export const saveSettingsBulk = async (settingsArray: { key: string, value: string, category?: string }[]) => {
    // Upsert each setting
    const results = [];
    for (const s of settingsArray) {
        const record = await prisma.setting.upsert({
            where: { key: s.key },
            update: { value: s.value, description: s.category || undefined },
            create: { key: s.key, value: s.value, description: s.category || undefined }
        });
        results.push(record);
    }
    return results;
};

export const deleteSetting = async (key: string) => {
    try {
        await prisma.setting.delete({ where: { key } });
    } catch (e) {
        // ignore if not found
    }
    return true;
};
