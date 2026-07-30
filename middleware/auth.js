import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'fallback_secret_for_development';

export const isAuth = (req, res, next) => {
    const token = req.cookies.admin_token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.adminId = decoded.adminId;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
