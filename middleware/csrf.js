import crypto from 'crypto';

export const generateCsrfToken = (req, res, next) => {
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    next();
};

export const validateCsrfToken = (req, res, next) => {
    const token = req.headers['x-csrf-token'];
    
    if (!token || token !== req.session.csrfToken) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    
    next();
};
