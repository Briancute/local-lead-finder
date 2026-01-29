import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Send an email through SMTP
 */
export const sendEmail = async (req, res) => {
    try {
        const { to, subject, body } = req.body;

        if (!to || !subject || !body) {
            return res.status(400).json({
                error: 'Missing fields',
                message: 'Recipient, subject, and body are required'
            });
        }

        // Configure transporter with environment variables
        // If credentials are missing, this will fail gracefully or use a mock if desired
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Verify connection configuration
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('⚠️ SMTP credentials not configured. Email will not be sent.');
            return res.status(400).json({
                error: 'Email configuration missing',
                message: 'SMTP credentials are not set in the server environment.'
            });
        }

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"LeadFinder Outreach" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text: body,
            html: body.replace(/\n/g, '<br>'), // Simple text to html conversion
        });

        console.log('📬 Message sent: %s', info.messageId);

        res.json({
            message: 'Email sent successfully',
            messageId: info.messageId
        });
    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).json({
            error: 'Failed to send email',
            message: error.message
        });
    }
};
