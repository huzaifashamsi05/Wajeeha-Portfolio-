import express from 'express';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import { db } from '../database.js';

const router = express.Router();

// Rate limiter: max 3 requests per hour
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: { error: 'Too many requests. Please try again later.' }
});

router.post('/contact', contactLimiter, async (req, res) => {
    const { name, email, message, honeypot } = req.body;

    // Honeypot check
    if (honeypot) {
        // Silently succeed to fool bots
        return res.json({ success: true });
    }

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Save to database
        await db.execute({
            sql: 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
            args: [name, email, message]
        });
        await db.execute('UPDATE analytics SET contact_submissions = contact_submissions + 1 WHERE id = 1');

        // Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'test@example.com',
                pass: process.env.EMAIL_PASS || 'dummy_pass'
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER || 'test@example.com',
            to: 'wajeehaimran86@gmail.com',
            subject: `New Portfolio Message from ${name}`,
            text: `You have a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailErr) {
            console.log("Email could not be sent. Credentials might not be configured. Message was saved to DB.");
        }

        res.json({ success: true, message: 'Message sent successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
