import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port: env.SMTP_PORT || 587,
    secure: env.SMTP_SECURE || false,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

export interface EmailResult {
    success: boolean;
    error?: string;
    provider?: 'resend' | 'smtp';
}

export const sendEmail = async (to: string, subject: string, html: string): Promise<EmailResult> => {
    console.log(`✉️ [Email System] Attempting delivery to: ${to}`);
    const provider = env.EMAIL_PROVIDER || 'gmail';

    // 1. Try Resend if specifically selected
    if (provider === 'resend' && env.RESEND_API_KEY && env.RESEND_API_KEY !== 'undefined') {
        console.log('🚀 [Email System] Route: Resend API');
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); 

            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM}>`,
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
            } else {
                const errorMsg = data.message || JSON.stringify(data);
                console.error('❌ [Email System] Resend Rejected:', errorMsg);
                return { success: false, error: `Resend API Error: ${errorMsg}`, provider: 'resend' };
            }
        } catch (error: any) {
            console.error('❌ [Email System] Resend Connection Error:', error.message);
        }
    }

    // 2. Default/Fallback to SMTP (Gmail)
    if (!env.SMTP_USER || !env.SMTP_PASS) {
        const warning = '⚠️ [Email System] Configuration Failed: Missing SMTP credentials in .env';
        console.warn(warning);
        return { success: false, error: 'Email configuration missing' };
    }

    console.log(`🔗 [Email System] Route: SMTP (${env.SMTP_HOST})`);
    try {
        const info = await transporter.sendMail({
            from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM}>`,
            to,
            subject,
            html,
        });
        console.log(`✅ [Email System] SMTP Success. Message ID: ${info.messageId}`);
        return { success: true, provider: 'smtp' };
    } catch (error: any) {
        console.error('❌ [Email System] SMTP Error:', error.message);
        return { success: false, error: `SMTP Error: ${error.message}`, provider: 'smtp' };
    }
};

// --- Predefined Templates ---

export const sendCredentialsEmail = async (to: string, studentName: string, studentId: string, tempPassword: string): Promise<EmailResult> => {
    const subject = 'Welcome to NSM Swimming Academy — Your Login Credentials';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #1C5CAA;">Welcome, ${studentName}!</h2>
            <p>You have been successfully registered at <strong>NSM Swimming Academy</strong>. Below are your login credentials for the mobile app.</p>
            <div style="background-color: #f0f6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1C5CAA;">
                <p style="margin: 0 0 8px 0; font-weight: bold; color: #0B213F;">Your Login Details:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 6px 0; color: #476082; font-weight: bold; width: 140px;">Email Address:</td>
                        <td style="padding: 6px 0; color: #0B213F; font-weight: bold;">${to}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #476082; font-weight: bold;">Temporary Password:</td>
                        <td style="padding: 6px 0; color: #1C5CAA; font-weight: bold; font-size: 18px; letter-spacing: 2px;">${tempPassword}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #476082; font-weight: bold;">Student ID:</td>
                        <td style="padding: 6px 0; color: #0B213F; font-weight: bold;">${studentId}</td>
                    </tr>
                </table>
            </div>
            <p style="color: #d97706; font-weight: bold;">⚠️ Please keep your password safe. You can use it to log in to the NSM Swimming Academy mobile app.</p>
            <p>Use your <strong>email address</strong> and the password above to log in. Your branch and schedule will be assigned automatically.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; font-size: 13px; color: #475569; border: 1px solid #e2e8f0;">
                <h3 style="color: #0B213F; margin-top: 0; font-size: 16px;">NSM Swimming Pool Rules & Policies</h3>
                <ul style="padding-left: 20px; margin-bottom: 20px; line-height: 1.5;">
                    <li>No running or pushing around the pool area.</li>
                    <li>Do not enter the pool without the coach’s permission.</li>
                    <li>Proper swimwear is required at all times.</li>
                    <li>Swimming cap and goggles are compulsory.</li>
                    <li>Do not enter the pool if you have any skin infection or illness. Please consult a doctor first. NSM will not be responsible in such cases.</li>
                    <li>Inside the water, students are our responsibility. Outside the pool, parents/guardians are responsible for their child’s safety. NSM will not be responsible for any incidents outside the pool.</li>
                    <li>Please arrive 10 minutes before your class. Late arrivals may miss their session.</li>
                    <li>Inform at least 12 hours in advance if you are unable to attend. Late notice or no-show will be counted as a class.</li>
                    <li>Avoid interrupting the class during sessions.</li>
                    <li>Keep valuables at home. Management is not responsible for any loss or damage.</li>
                    <li>Respect coaches, staff, and fellow swimmers at all times.</li>
                </ul>
                <h4 style="color: #0B213F; margin-bottom: 10px; font-size: 14px;">Membership Policies</h4>
                <ul style="padding-left: 20px; margin-bottom: 0; line-height: 1.5;">
                    <li><strong>No Refund Policy</strong></li>
                    <li>Extension of the Membership for 7/15/30 days will be charged 30/60/120 AED</li>
                    <li>Absent Class should be rescheduled within the activation time period of membership</li>
                    <li>Group class will be 4-5 people</li>
                    <li>All Prices are for Group class</li>
                    <li>All prices are exclusive of 5% VAT</li>
                </ul>
            </div>
            <p style="font-size: 12px; color: #64748b;">Best Regards,<br>NSM Swimming Academy Team</p>
        </div>
    `;
    return await sendEmail(to, subject, html);
};

export const sendWelcomeEmail = async (to: string, studentName: string, studentId: string): Promise<EmailResult> => {
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
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; font-size: 13px; color: #475569; border: 1px solid #e2e8f0;">
                <h3 style="color: #0B213F; margin-top: 0; font-size: 16px;">NSM Swimming Pool Rules & Policies</h3>
                <ul style="padding-left: 20px; margin-bottom: 20px; line-height: 1.5;">
                    <li>No running or pushing around the pool area.</li>
                    <li>Do not enter the pool without the coach’s permission.</li>
                    <li>Proper swimwear is required at all times.</li>
                    <li>Swimming cap and goggles are compulsory.</li>
                    <li>Do not enter the pool if you have any skin infection or illness. Please consult a doctor first. NSM will not be responsible in such cases.</li>
                    <li>Inside the water, students are our responsibility. Outside the pool, parents/guardians are responsible for their child’s safety. NSM will not be responsible for any incidents outside the pool.</li>
                    <li>Please arrive 10 minutes before your class. Late arrivals may miss their session.</li>
                    <li>Inform at least 12 hours in advance if you are unable to attend. Late notice or no-show will be counted as a class.</li>
                    <li>Avoid interrupting the class during sessions.</li>
                    <li>Keep valuables at home. Management is not responsible for any loss or damage.</li>
                    <li>Respect coaches, staff, and fellow swimmers at all times.</li>
                </ul>
                <h4 style="color: #0B213F; margin-bottom: 10px; font-size: 14px;">Membership Policies</h4>
                <ul style="padding-left: 20px; margin-bottom: 0; line-height: 1.5;">
                    <li><strong>No Refund Policy</strong></li>
                    <li>Extension of the Membership for 7/15/30 days will be charged 30/60/120 AED</li>
                    <li>Absent Class should be rescheduled within the activation time period of membership</li>
                    <li>Group class will be 4-5 people</li>
                    <li>All Prices are for Group class</li>
                    <li>All prices are exclusive of 5% VAT</li>
                </ul>
            </div>
            <p style="font-size: 12px; color: #64748b;">Best Regards,<br>NSM Swimming Academy Team</p>
        </div>
    `;
    return await sendEmail(to, subject, html);
};


export const sendMissedClassEmail = async (to: string, studentName: string, date: string) => {
    const subject = 'Missed Class Notification - NSM Swimming Academy';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <p>Hi ${studentName},</p>
            <p>We noticed you missed your swimming class scheduled on <strong>${date}</strong>.</p>
            <p>If you'd like to schedule a makeup class (if eligible), please contact your branch or check the app.</p>
            <p>Best,<br>NSM Swimming Academy Team</p>
        </div>
    `;
    await sendEmail(to, subject, html);
};

export const sendPaymentDueEmail = async (to: string, studentName: string, amount: number, dueDate: string) => {
    const subject = 'Payment Reminder - NSM Swimming Academy';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <p>Dear ${studentName},</p>
            <p>This is a friendly reminder that a payment of <strong>AED ${amount}</strong> is due on <strong>${dueDate}</strong>.</p>
            <p>Please log in to your portal to complete the payment.</p>
            <p>Thank you!</p>
        </div>
    `;
    await sendEmail(to, subject, html);
};

export const sendPasswordResetEmail = async (to: string, resetToken: string) => {
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
    await sendEmail(to, subject, html);
};
