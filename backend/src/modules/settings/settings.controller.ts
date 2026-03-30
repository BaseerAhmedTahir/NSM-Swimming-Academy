import { Request, Response, NextFunction } from 'express';
import * as settingsService from './settings.service';
import { successResponse } from '../../utils/response';

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = req.query.category as string;
        const settings = await settingsService.getSettingsByCategory(category);
        return successResponse({ res, data: settings });
    } catch (error) {
        next(error);
    }
};

export const saveSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { settings } = req.body;
        const result = await settingsService.saveSettingsBulk(settings);
        return successResponse({ res, data: result, message: 'Settings saved successfully' });
    } catch (error) {
        next(error);
    }
};
