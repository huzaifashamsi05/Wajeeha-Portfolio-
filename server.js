import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { initializeDatabase } from './database.js';

import publicRoutes from './routes/public.js';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Allow Vite proxy
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_for_development',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize DB
initializeDatabase();

// Routes
app.use('/api', publicRoutes);
app.use('/api', contactRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;

app.listen(PORT, () => {
    console.log(`Backend API Server running on port ${PORT}`);
});
