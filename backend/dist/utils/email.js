"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendPaymentDueEmail = exports.sendMissedClassEmail = exports.sendWelcomeEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.env.SMTP_HOST || 'smtp.gmail.com',
    port: env_1.env.SMTP_PORT || 587,
    secure: env_1.env.SMTP_SECURE || false,
    auth: {
        user: env_1.env.SMTP_USER,
        pass: env_1.env.SMTP_PASS,
    },
});
const sendEmail = async (to, subject, html) => {
    console.log(`✉️ [Email System] Attempting delivery to: ${to}`);
    // 1. Try Resend API if key is provided
    if (env_1.env.RESEND_API_KEY && env_1.env.RESEND_API_KEY !== 'undefined' && env_1.env.RESEND_API_KEY.length > 5) {
        console.log('🚀 [Email System] Route: Resend API');
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${env_1.env.RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: `${env_1.env.EMAIL_FROM_NAME} <${env_1.env.EMAIL_FROM}>`,
                    to: [to],
                    subject: subject,
                    html: html,
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const data = await response.json();
            if (response.ok) {
                console.log(`✅ [Email System] Resend Success. ID: ${data.id}`);
                return { success: true, provider: 'resend' };
            }
            else {
                const errorMsg = data.message || JSON.stringify(data);
                console.error('❌ [Email System] Resend Rejected:', errorMsg);
                return { success: false, error: `Resend API Error: ${errorMsg}`, provider: 'resend' };
            }
        }
        catch (error) {
            const errorMsg = error.name === 'AbortError' ? 'Connection timed out' : error.message;
            console.error('❌ [Email System] Resend Connection Error:', errorMsg);
            // If Resend connection fails, we don't fallback here to keep it predictable, 
            // or you can choose to fallback to SMTP if configured
        }
    }
    // 2. Fallback to SMTP
    if (!env_1.env.SMTP_USER || !env_1.env.SMTP_PASS) {
        const warning = '⚠️ [Email System] Delivery Failed: No valid Resend API Key and no SMTP credentials in .env';
        console.warn(warning);
        return { success: false, error: 'Email configuration missing (Resend API Key or SMTP credentials)' };
    }
    console.log('🔗 [Email System] Route: SMTP');
    try {
        const info = await transporter.sendMail({
            from: `"${env_1.env.EMAIL_FROM_NAME}" <${env_1.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
        });
        console.log(`✅ [Email System] SMTP Success. Message ID: ${info.messageId}`);
        return { success: true, provider: 'smtp' };
    }
    catch (error) {
        console.error('❌ [Email System] SMTP Error:', error.message);
        return { success: false, error: `SMTP Error: ${error.message}`, provider: 'smtp' };
    }
};
exports.sendEmail = sendEmail;
// --- Predefined Templates ---
const sendWelcomeEmail = async (to, studentName, studentId) => {
    const subject = 'Welcome to NSM Swimming Academy!';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #1C5CAA;">Welcome, ${studentName}!</h2>
            <p>Thank you for joining NSM Swimming Academy. We are thrilled to have you with us.</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: #0B213F;">Your Unique Student ID:</p>
                <h1 style="margin: 10px 0; color: #1C5CAA; letter-spacing: 2px;">${studentId}</h1>
            </div>
            <p>Use this ID to check your schedule and track your progress in our mobile app.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">Best Regards,<br>NSM Swimming Academy Team</p>
        </div>
    `;
    return await (0, exports.sendEmail)(to, subject, html);
};
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendMissedClassEmail = async (to, studentName, date) => {
    const subject = 'Missed Class Notification - NSM Swimming Academy';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <p>Hi ${studentName},</p>
            <p>We noticed you missed your swimming class scheduled on <strong>${date}</strong>.</p>
            <p>If you'd like to schedule a makeup class (if eligible), please contact your branch or check the app.</p>
            <p>Best,<br>NSM Swimming Academy Team</p>
        </div>
    `;
    await (0, exports.sendEmail)(to, subject, html);
};
exports.sendMissedClassEmail = sendMissedClassEmail;
const sendPaymentDueEmail = async (to, studentName, amount, dueDate) => {
    const subject = 'Payment Reminder - NSM Swimming Academy';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <p>Dear ${studentName},</p>
            <p>This is a friendly reminder that a payment of <strong>AED ${amount}</strong> is due on <strong>${dueDate}</strong>.</p>
            <p>Please log in to your portal to complete the payment.</p>
            <p>Thank you!</p>
        </div>
    `;
    await (0, exports.sendEmail)(to, subject, html);
};
exports.sendPaymentDueEmail = sendPaymentDueEmail;
const sendPasswordResetEmail = async (to, resetToken) => {
    const subject = 'Password Reset Request';
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <p>You requested a password reset for your NSM Swimming Academy account.</p>
            <p>Click the link below to set a new password:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #0162E8; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
        </div>
    `;
    await (0, exports.sendEmail)(to, subject, html);
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
