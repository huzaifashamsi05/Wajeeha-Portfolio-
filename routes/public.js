import express from 'express';
import { db } from '../database.js';

const router = express.Router();

router.get('/bio', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM bio LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/education', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM education ORDER BY order_index ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/skills', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM skills ORDER BY order_index ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/projects', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM projects ORDER BY order_index ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/certifications', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM certifications ORDER BY order_index ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/services', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM services ORDER BY order_index ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/testimonials', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM testimonials ORDER BY order_index ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/social-links', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM social_links');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/hobbies', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM hobbies ORDER BY order_index ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/settings', async (req, res) => {
    try {
        const result = await db.execute('SELECT availability_banner_enabled, banner_text, site_stats_json FROM settings LIMIT 1');
        const settings = result.rows[0];
        if (settings && settings.site_stats_json) {
            settings.site_stats_json = JSON.parse(settings.site_stats_json);
        }
        res.json(settings || {});
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Analytics tracking
router.post('/track-pageview', async (req, res) => {
    try {
        await db.execute('UPDATE analytics SET page_views = page_views + 1 WHERE id = 1');
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/track-cv-download', async (req, res) => {
    try {
        await db.execute('UPDATE analytics SET cv_downloads = cv_downloads + 1 WHERE id = 1');
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
