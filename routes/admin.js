import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../database.js';
import { isAuth } from '../middleware/auth.js';
import { generateCsrfToken, validateCsrfToken } from '../middleware/csrf.js';

const router = express.Router();

// Multer storage for CV and Certifications
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = 'public/uploads/';
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// CSRF Token route (GET)
router.get('/csrf-token', generateCsrfToken, (req, res) => {
    res.json({ csrfToken: req.csrfToken });
});

// Login rate limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many login attempts. Please try again later.' }
});

const JWT_SECRET = process.env.SESSION_SECRET || 'fallback_secret_for_development';

router.post('/login', loginLimiter, validateCsrfToken, async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = (await db.execute('SELECT id, admin_username, admin_password_hash FROM settings LIMIT 1')).rows[0];
        if (!admin || admin.admin_username !== username) return res.status(401).json({ error: 'Access Denied — check your username or password' });
        const isMatch = bcrypt.compareSync(password, admin.admin_password_hash);
        if (!isMatch) return res.status(401).json({ error: 'Access Denied — check your username or password' });
        
        const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '24h' });
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ success: true, message: 'Logged in successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/logout', async (req, res) => {
    res.clearCookie('admin_token');
    res.json({ success: true, message: 'Logged out successfully' });
});

// Authentication middleware applied to all routes below
router.use(isAuth);
// Validate CSRF token for all state-changing methods
router.use((req, res, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        return validateCsrfToken(req, res, next);
    }
    next();
});

// Auth Check (for React router)
router.get('/check-auth', async (req, res) => { res.json({ authenticated: true }); });

// Analytics Dashboard Route
router.get('/analytics', async (req, res) => {
    try {
        const analytics = (await db.execute('SELECT * FROM analytics LIMIT 1')).rows[0] || { page_views: 0, cv_downloads: 0, contact_submissions: 0 };
        const unreadMessagesCount = (await db.execute('SELECT COUNT(*) as count FROM messages WHERE is_read = 0')).rows[0].count;
        const recentMessages = (await db.execute('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 5')).rows;
        res.json({ ...analytics, unread_messages: unreadMessagesCount, recent_messages: recentMessages });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// MESSAGES
router.get('/messages', async (req, res) => {
    res.json((await db.execute('SELECT * FROM messages ORDER BY timestamp DESC')).rows);
});
router.put('/messages/:id/read', async (req, res) => {
    await db.execute({ sql: 'UPDATE messages SET is_read = 1 WHERE id = ?', args: [req.params.id] });
    res.json({ success: true });
});
router.delete('/messages/:id', async (req, res) => {
    await db.execute({ sql: 'DELETE FROM messages WHERE id = ?', args: [req.params.id] });
    res.json({ success: true });
});

// BIO
router.get('/bio', async (req, res) => { res.json((await db.execute('SELECT * FROM bio LIMIT 1')).rows[0] || {}); });
router.put('/bio', async (req, res) => {
    const { about_text, hero_subtitle, availability_status, location, languages, phone, email } = req.body;
    await db.execute({ sql: 'UPDATE bio SET about_text=?, hero_subtitle=?, availability_status=?, location=?, languages=?, phone=?, email=? WHERE id = 1', args: [about_text, hero_subtitle, availability_status, location, languages, phone, email] });
    res.json({ success: true });
});

// EDUCATION
router.post('/education', async (req, res) => {
    const { degree, institution, board_or_note, start_year, end_year, description, order_index } = req.body;
    await db.execute({ sql: 'INSERT INTO education (degree, institution, board_or_note, start_year, end_year, description, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)', args: [degree, institution, board_or_note, start_year, end_year, description, order_index || 0] });
    res.json({ success: true });
});
router.put('/education/:id', async (req, res) => {
    const { degree, institution, board_or_note, start_year, end_year, description, order_index } = req.body;
    await db.execute({ sql: 'UPDATE education SET degree=?, institution=?, board_or_note=?, start_year=?, end_year=?, description=?, order_index=? WHERE id=?', args: [degree, institution, board_or_note, start_year, end_year, description, order_index || 0, req.params.id] });
    res.json({ success: true });
});
router.delete('/education/:id', async (req, res) => {
    await db.execute({ sql: 'DELETE FROM education WHERE id=?', args: [req.params.id] });
    res.json({ success: true });
});

// SKILLS
router.post('/skills', async (req, res) => {
    const { name, category, percentage, order_index } = req.body;
    await db.execute({ sql: 'INSERT INTO skills (name, category, percentage, order_index) VALUES (?, ?, ?, ?)', args: [name, category, percentage, order_index || 0] });
    res.json({ success: true });
});
router.put('/skills/:id', async (req, res) => {
    const { name, category, percentage, order_index } = req.body;
    await db.execute({ sql: 'UPDATE skills SET name=?, category=?, percentage=?, order_index=? WHERE id=?', args: [name, category, percentage, order_index || 0, req.params.id] });
    res.json({ success: true });
});
router.delete('/skills/:id', async (req, res) => {
    await db.execute({ sql: 'DELETE FROM skills WHERE id=?', args: [req.params.id] });
    res.json({ success: true });
});

// PROJECTS
router.post('/projects', async (req, res) => {
    const { title, category, description, tech_badges, github_url, live_url, status_badge, is_featured, order_index } = req.body;
    await db.execute({ sql: 'INSERT INTO projects (title, category, description, tech_badges, github_url, live_url, status_badge, is_featured, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', args: [title, category, description, tech_badges, github_url, live_url, status_badge, is_featured ? 1 : 0, order_index || 0] });
    res.json({ success: true });
});
router.put('/projects/:id', async (req, res) => {
    const { title, category, description, tech_badges, github_url, live_url, status_badge, is_featured, order_index } = req.body;
    await db.execute({ sql: 'UPDATE projects SET title=?, category=?, description=?, tech_badges=?, github_url=?, live_url=?, status_badge=?, is_featured=?, order_index=? WHERE id=?', args: [title, category, description, tech_badges, github_url, live_url, status_badge, is_featured ? 1 : 0, order_index || 0, req.params.id] });
    res.json({ success: true });
});
router.delete('/projects/:id', async (req, res) => {
    await db.execute({ sql: 'DELETE FROM projects WHERE id=?', args: [req.params.id] });
    res.json({ success: true });
});

// CERTIFICATIONS
router.post('/certifications', async (req, res) => {
    const { title, issuing_org, date, image_url, verify_url, order_index } = req.body;
    await db.execute({ sql: 'INSERT INTO certifications (title, issuing_org, date, image_url, verify_url, order_index) VALUES (?, ?, ?, ?, ?, ?)', args: [title, issuing_org, date, image_url, verify_url, order_index || 0] });
    res.json({ success: true });
});
router.put('/certifications/:id', async (req, res) => {
    const { title, issuing_org, date, image_url, verify_url, order_index } = req.body;
    await db.execute({ sql: 'UPDATE certifications SET title=?, issuing_org=?, date=?, image_url=?, verify_url=?, order_index=? WHERE id=?', args: [title, issuing_org, date, image_url, verify_url, order_index || 0, req.params.id] });
    res.json({ success: true });
});
router.delete('/certifications/:id', async (req, res) => {
    await db.execute({ sql: 'DELETE FROM certifications WHERE id=?', args: [req.params.id] });
    res.json({ success: true });
});

// SERVICES
router.post('/services', async (req, res) => {
    const { title, description, icon_name, order_index } = req.body;
    await db.execute({ sql: 'INSERT INTO services (title, description, icon_name, order_index) VALUES (?, ?, ?, ?)', args: [title, description, icon_name, order_index || 0] });
    res.json({ success: true });
});
router.put('/services/:id', async (req, res) => {
    const { title, description, icon_name, order_index } = req.body;
    await db.execute({ sql: 'UPDATE services SET title=?, description=?, icon_name=?, order_index=? WHERE id=?', args: [title, description, icon_name, order_index || 0, req.params.id] });
    res.json({ success: true });
});
router.delete('/services/:id', async (req, res) => {
    await db.execute({ sql: 'DELETE FROM services WHERE id=?', args: [req.params.id] });
    res.json({ success: true });
});

// TESTIMONIALS
router.post('/testimonials', async (req, res) => {
    const { name, role, quote, rating, order_index } = req.body;
    await db.execute({ sql: 'INSERT INTO testimonials (name, role, quote, rating, order_index) VALUES (?, ?, ?, ?, ?)', args: [name, role, quote, rating, order_index || 0] });
    res.json({ success: true });
});
router.put('/testimonials/:id', async (req, res) => {
    const { name, role, quote, rating, order_index } = req.body;
    await db.execute({ sql: 'UPDATE testimonials SET name=?, role=?, quote=?, rating=?, order_index=? WHERE id=?', args: [name, role, quote, rating, order_index || 0, req.params.id] });
    res.json({ success: true });
});
router.delete('/testimonials/:id', async (req, res) => {
    await db.execute({ sql: 'DELETE FROM testimonials WHERE id=?', args: [req.params.id] });
    res.json({ success: true });
});

// SOCIAL LINKS (Only edit/toggle allowed)
router.put('/social-links/:id', async (req, res) => {
    const { url, is_visible } = req.body;
    await db.execute({ sql: 'UPDATE social_links SET url=?, is_visible=? WHERE id=?', args: [url, is_visible ? 1 : 0, req.params.id] });
    res.json({ success: true });
});

// HOBBIES
router.post('/hobbies', async (req, res) => {
    const { label, icon_emoji, order_index } = req.body;
    await db.execute({ sql: 'INSERT INTO hobbies (label, icon_emoji, order_index) VALUES (?, ?, ?)', args: [label, icon_emoji, order_index || 0] });
    res.json({ success: true });
});
router.put('/hobbies/:id', async (req, res) => {
    const { label, icon_emoji, order_index } = req.body;
    await db.execute({ sql: 'UPDATE hobbies SET label=?, icon_emoji=?, order_index=? WHERE id=?', args: [label, icon_emoji, order_index || 0, req.params.id] });
    res.json({ success: true });
});
router.delete('/hobbies/:id', async (req, res) => {
    await db.execute({ sql: 'DELETE FROM hobbies WHERE id=?', args: [req.params.id] });
    res.json({ success: true });
});

// SETTINGS
router.put('/settings', async (req, res) => {
    const { availability_banner_enabled, banner_text, site_stats_json } = req.body;
    await db.execute({ sql: 'UPDATE settings SET availability_banner_enabled=?, banner_text=?, site_stats_json=? WHERE id=1', args: [availability_banner_enabled ? 1 : 0, banner_text, JSON.stringify(site_stats_json)] });
    res.json({ success: true });
});
router.put('/settings/password', async (req, res) => {
    const { current_password, new_password } = req.body;
    const admin = (await db.execute('SELECT admin_password_hash FROM settings WHERE id=1')).rows[0];
    if (!bcrypt.compareSync(current_password, admin.admin_password_hash)) {
        return res.status(400).json({ error: 'Incorrect current password' });
    }
    const hash = bcrypt.hashSync(new_password, 10);
    await db.execute({ sql: 'UPDATE settings SET admin_password_hash=? WHERE id=1', args: [hash] });
    res.json({ success: true, message: 'Password updated successfully' });
});

// FILE UPLOADS
router.post('/upload-cv', upload.single('cv'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    // In a real app, update DB or rename to a fixed name. 
    // The public site expects 'assets/cv.pdf'. 
    // We will move/rename the uploaded file to 'public/assets/cv.pdf'.
    const targetPath = path.join(process.cwd(), 'public', 'assets', 'cv.pdf');
    if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
    fs.renameSync(req.file.path, targetPath);
    res.json({ success: true, message: 'CV uploaded successfully' });
});

router.post('/upload-image', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
});

export default router;
