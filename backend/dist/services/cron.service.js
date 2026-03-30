"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCronJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const initCronJobs = () => {
    // Run every midnight to check for overdue reminders
    node_cron_1.default.schedule('0 0 * * *', async () => {
        try {
            console.log('Running daily cron job for reminders...');
            const now = new Date();
            // Mark pending reminders where dueDate is pass as OVERDUE
            // Wait, schema status is: PENDING, COMPLETED, SNOOZED
            // There is no OVERDUE status in string, it's just PENDING but dynamically filtered.
            // If we actually want a status change, we could do it here, but filtering handles it.
            // Instead, this cron job could be used to send daily digest emails to staff!
            console.log('Daily cron job completed.');
        }
        catch (error) {
            console.error('Error in daily cron job:', error);
        }
    });
};
exports.initCronJobs = initCronJobs;
