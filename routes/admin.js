import express from 'express';
import bcrypt from 'bcryptjs';
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
    res.json({ csrfToken: req.session.csrfToken });
});

// Login rate limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many login attempts. Please try again later.' }
});

router.post('/login', loginLimiter, validateCsrfToken, (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = db.prepare('SELECT id, admin_username, admin_password_hash FROM settings LIMIT 1').get();
        if (!admin || admin.admin_username !== username) return res.status(401).json({ error: 'Access Denied — check your username or password' });
        const isMatch = bcrypt.compareSync(password, admin.admin_password_hash);
        if (!isMatch) return res.status(401).json({ error: 'Access Denied — check your username or password' });
        
        req.session.adminId = admin.id;
        res.json({ success: true, message: 'Logged in successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
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
router.get('/check-auth', (req, res) => res.json({ authenticated: true }));

// Analytics Dashboard Route
router.get('/analytics', (req, res) => {
    try {
        const analytics = db.prepare('SELECT * FROM analytics LIMIT 1').get() || { page_views: 0, cv_downloads: 0, contact_submissions: 0 };
        const unreadMessagesCount = db.prepare('SELECT COUNT(*) as count FROM messages WHERE is_read = 0').get().count;
        const recentMessages = db.prepare('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 5').all();
        res.json({ ...analytics, unread_messages: unreadMessagesCount, recent_messages: recentMessages });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// MESSAGES
router.get('/messages', (req, res) => {
    res.json(db.prepare('SELECT * FROM messages ORDER BY timestamp DESC').all());
});
router.put('/messages/:id/read', (req, res) => {
    db.prepare('UPDATE messages SET is_read = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});
router.delete('/messages/:id', (req, res) => {
    db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

// BIO
router.get('/bio', (req, res) => res.json(db.prepare('SELECT * FROM bio LIMIT 1').get() || {}));
router.put('/bio', (req, res) => {
    const { about_text, hero_subtitle, availability_status, location, languages, phone, email } = req.body;
    db.prepare('UPDATE bio SET about_text=?, hero_subtitle=?, availability_status=?, location=?, languages=?, phone=?, email=? WHERE id = 1')
      .run(about_text, hero_subtitle, availability_status, location, languages, phone, email);
    res.json({ success: true });
});

// EDUCATION
router.post('/education', (req, res) => {
    const { degree, institution, board_or_note, start_year, end_year, description, order_index } = req.body;
    db.prepare('INSERT INTO education (degree, institution, board_or_note, start_year, end_year, description, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(degree, institution, board_or_note, start_year, end_year, description, order_index || 0);
    res.json({ success: true });
});
router.put('/education/:id', (req, res) => {
    const { degree, institution, board_or_note, start_year, end_year, description, order_index } = req.body;
    db.prepare('UPDATE education SET degree=?, institution=?, board_or_note=?, start_year=?, end_year=?, description=?, order_index=? WHERE id=?')
      .run(degree, institution, board_or_note, start_year, end_year, description, order_index || 0, req.params.id);
    res.json({ success: true });
});
router.delete('/education/:id', (req, res) => {
    db.prepare('DELETE FROM education WHERE id=?').run(req.params.id);
    res.json({ success: true });
});

// SKILLS
router.post('/skills', (req, res) => {
    const { name, category, percentage, order_index } = req.body;
    db.prepare('INSERT INTO skills (name, category, percentage, order_index) VALUES (?, ?, ?, ?)')
      .run(name, category, percentage, order_index || 0);
    res.json({ success: true });
});
router.put('/skills/:id', (req, res) => {
    const { name, category, percentage, order_index } = req.body;
    db.prepare('UPDATE skills SET name=?, category=?, percentage=?, order_index=? WHERE id=?')
      .run(name, category, percentage, order_index || 0, req.params.id);
    res.json({ success: true });
});
router.delete('/skills/:id', (req, res) => {
    db.prepare('DELETE FROM skills WHERE id=?').run(req.params.id);
    res.json({ success: true });
});

// PROJECTS
router.post('/projects', (req, res) => {
    const { title, category, description, tech_badges, github_url, live_url, status_badge, is_featured, order_index } = req.body;
    db.prepare('INSERT INTO projects (title, category, description, tech_badges, github_url, live_url, status_badge, is_featured, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(title, category, description, tech_badges, github_url, live_url, status_badge, is_featured ? 1 : 0, order_index || 0);
    res.json({ success: true });
});
router.put('/projects/:id', (req, res) => {
    const { title, category, description, tech_badges, github_url, live_url, status_badge, is_featured, order_index } = req.body;
    db.prepare('UPDATE projects SET title=?, category=?, description=?, tech_badges=?, github_url=?, live_url=?, status_badge=?, is_featured=?, order_index=? WHERE id=?')
      .run(title, category, description, tech_badges, github_url, live_url, status_badge, is_featured ? 1 : 0, order_index || 0, req.params.id);
    res.json({ success: true });
});
router.delete('/projects/:id', (req, res) => {
    db.prepare('DELETE FROM projects WHERE id=?').run(req.params.id);
    res.json({ success: true });
});

// CERTIFICATIONS
router.post('/certifications', (req, res) => {
    const { title, issuing_org, date, image_url, verify_url, order_index } = req.body;
    db.prepare('INSERT INTO certifications (title, issuing_org, date, image_url, verify_url, order_index) VALUES (?, ?, ?, ?, ?, ?)')
      .run(title, issuing_org, date, image_url, verify_url, order_index || 0);
    res.json({ success: true });
});
router.put('/certifications/:id', (req, res) => {
    const { title, issuing_org, date, image_url, verify_url, order_index } = req.body;
    db.prepare('UPDATE certifications SET title=?, issuing_org=?, date=?, image_url=?, verify_url=?, order_index=? WHERE id=?')
      .run(title, issuing_org, date, image_url, verify_url, order_index || 0, req.params.id);
    res.json({ success: true });
});
router.delete('/certifications/:id', (req, res) => {
    db.prepare('DELETE FROM certifications WHERE id=?').run(req.params.id);
    res.json({ success: true });
});

// SERVICES
router.post('/services', (req, res) => {
    const { title, description, icon_name, order_index } = req.body;
    db.prepare('INSERT INTO services (title, description, icon_name, order_index) VALUES (?, ?, ?, ?)')
      .run(title, description, icon_name, order_index || 0);
    res.json({ success: true });
});
router.put('/services/:id', (req, res) => {
    const { title, description, icon_name, order_index } = req.body;
    db.prepare('UPDATE services SET title=?, description=?, icon_name=?, order_index=? WHERE id=?')
      .run(title, description, icon_name, order_index || 0, req.params.id);
    res.json({ success: true });
});
router.delete('/services/:id', (req, res) => {
    db.prepare('DELETE FROM services WHERE id=?').run(req.params.id);
    res.json({ success: true });
});

// TESTIMONIALS
router.post('/testimonials', (req, res) => {
    const { name, role, quote, rating, order_index } = req.body;
    db.prepare('INSERT INTO testimonials (name, role, quote, rating, order_index) VALUES (?, ?, ?, ?, ?)')
      .run(name, role, quote, rating, order_index || 0);
    res.json({ success: true });
});
router.put('/testimonials/:id', (req, res) => {
    const { name, role, quote, rating, order_index } = req.body;
    db.prepare('UPDATE testimonials SET name=?, role=?, quote=?, rating=?, order_index=? WHERE id=?')
      .run(name, role, quote, rating, order_index || 0, req.params.id);
    res.json({ success: true });
});
router.delete('/testimonials/:id', (req, res) => {
    db.prepare('DELETE FROM testimonials WHERE id=?').run(req.params.id);
    res.json({ success: true });
});

// SOCIAL LINKS (Only edit/toggle allowed)
router.put('/social-links/:id', (req, res) => {
    const { url, is_visible } = req.body;
    db.prepare('UPDATE social_links SET url=?, is_visible=? WHERE id=?')
      .run(url, is_visible ? 1 : 0, req.params.id);
    res.json({ success: true });
});

// HOBBIES
router.post('/hobbies', (req, res) => {
    const { label, icon_emoji, order_index } = req.body;
    db.prepare('INSERT INTO hobbies (label, icon_emoji, order_index) VALUES (?, ?, ?)')
      .run(label, icon_emoji, order_index || 0);
    res.json({ success: true });
});
router.put('/hobbies/:id', (req, res) => {
    const { label, icon_emoji, order_index } = req.body;
    db.prepare('UPDATE hobbies SET label=?, icon_emoji=?, order_index=? WHERE id=?')
      .run(label, icon_emoji, order_index || 0, req.params.id);
    res.json({ success: true });
});
router.delete('/hobbies/:id', (req, res) => {
    db.prepare('DELETE FROM hobbies WHERE id=?').run(req.params.id);
    res.json({ success: true });
});

// SETTINGS
router.put('/settings', (req, res) => {
    const { availability_banner_enabled, banner_text, site_stats_json } = req.body;
    db.prepare('UPDATE settings SET availability_banner_enabled=?, banner_text=?, site_stats_json=? WHERE id=1')
      .run(availability_banner_enabled ? 1 : 0, banner_text, JSON.stringify(site_stats_json));
    res.json({ success: true });
});
router.put('/settings/password', (req, res) => {
    const { current_password, new_password } = req.body;
    const admin = db.prepare('SELECT admin_password_hash FROM settings WHERE id=1').get();
    if (!bcrypt.compareSync(current_password, admin.admin_password_hash)) {
        return res.status(400).json({ error: 'Incorrect current password' });
    }
    const hash = bcrypt.hashSync(new_password, 10);
    db.prepare('UPDATE settings SET admin_password_hash=? WHERE id=1').run(hash);
    res.json({ success: true, message: 'Password updated successfully' });
});

// FILE UPLOADS
router.post('/upload-cv', upload.single('cv'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    // In a real app, update DB or rename to a fixed name. 
    // The public site expects 'assets/cv.pdf'. 
    // We will move/rename the uploaded file to 'public/assets/cv.pdf'.
    const targetPath = path.join(process.cwd(), 'public', 'assets', 'cv.pdf');
    if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
    fs.renameSync(req.file.path, targetPath);
    res.json({ success: true, message: 'CV uploaded successfully' });
});

router.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
});

export default router;
