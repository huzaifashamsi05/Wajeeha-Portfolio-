import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { initializeDatabase } from './database.js';

import publicRoutes from './routes/public.js';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
})); // Allow Vite proxy and cookies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize DB
initializeDatabase();

// Routes
app.use('/api', publicRoutes);
app.use('/api', contactRoutes);
app.use('/api/admin', adminRoutes);

// Remove the `app.listen` if running in Vercel to avoid EADDRINUSE, 
// Vercel serverless functions handle the listening. 
// We will export it as the default module instead.
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;
