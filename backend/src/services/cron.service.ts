import cron from 'node-cron';
import { prisma } from '../config/database';

export const initCronJobs = () => {
    // Run every midnight to check for overdue reminders
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Running daily cron job for reminders...');
            const now = new Date();
            
            // Mark pending reminders where dueDate is pass as OVERDUE
            // Wait, schema status is: PENDING, COMPLETED, SNOOZED
            // There is no OVERDUE status in string, it's just PENDING but dynamically filtered.
            // If we actually want a status change, we could do it here, but filtering handles it.
            // Instead, this cron job could be used to send daily digest emails to staff!
            
            console.log('Daily cron job completed.');
        } catch (error) {
            console.error('Error in daily cron job:', error);
        }
    });
};
