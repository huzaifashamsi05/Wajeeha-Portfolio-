import crypto from 'crypto';

export const generateCsrfToken = (req, res, next) => {
    let token = req.cookies.csrfToken;
    if (!token) {
        token = crypto.randomBytes(32).toString('hex');
        res.cookie('csrfToken', token, {
            httpOnly: false, // Must be accessible by frontend script to send in header
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });
    }
    // We attach it to req so the route can send it in JSON response
    req.csrfToken = token;
    next();
};

export const validateCsrfToken = (req, res, next) => {
    const headerToken = req.headers['x-csrf-token'];
    const cookieToken = req.cookies.csrfToken;
    
    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    
    next();
};
