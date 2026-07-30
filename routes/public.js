import express from 'express';
import { db } from '../database.js';

const router = express.Router();

router.get('/bio', (req, res) => {
    try {
        const bio = db.prepare('SELECT * FROM bio LIMIT 1').get();
        res.json(bio || {});
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/education', (req, res) => {
    try {
        const edu = db.prepare('SELECT * FROM education ORDER BY order_index ASC').all();
        res.json(edu);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/skills', (req, res) => {
    try {
        const skills = db.prepare('SELECT * FROM skills ORDER BY order_index ASC').all();
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/projects', (req, res) => {
    try {
        const projects = db.prepare('SELECT * FROM projects ORDER BY order_index ASC').all();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/certifications', (req, res) => {
    try {
        const certs = db.prepare('SELECT * FROM certifications ORDER BY order_index ASC').all();
        res.json(certs);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/services', (req, res) => {
    try {
        const services = db.prepare('SELECT * FROM services ORDER BY order_index ASC').all();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/testimonials', (req, res) => {
    try {
        const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY order_index ASC').all();
        res.json(testimonials);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/social-links', (req, res) => {
    try {
        const links = db.prepare('SELECT * FROM social_links').all();
        res.json(links);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/hobbies', (req, res) => {
    try {
        const hobbies = db.prepare('SELECT * FROM hobbies ORDER BY order_index ASC').all();
        res.json(hobbies);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/settings', (req, res) => {
    try {
        const settings = db.prepare('SELECT availability_banner_enabled, banner_text, site_stats_json FROM settings LIMIT 1').get();
        if (settings && settings.site_stats_json) {
            settings.site_stats_json = JSON.parse(settings.site_stats_json);
        }
        res.json(settings || {});
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Analytics tracking
router.post('/track-pageview', (req, res) => {
    try {
        db.prepare('UPDATE analytics SET page_views = page_views + 1 WHERE id = 1').run();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/track-cv-download', (req, res) => {
    try {
        db.prepare('UPDATE analytics SET cv_downloads = cv_downloads + 1 WHERE id = 1').run();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
