# 🚀 Professional Developer Portfolio

A highly dynamic, responsive, and aesthetically premium portfolio website built for showcasing software engineering and AI/ML skills. 

**Developed by**: [Huzaifa Shamsi](https://wa.me/923098333185)  
**Client**: Wajeeha Imran (BS Computer Science & AI/ML Enthusiast)

---

## 🌟 Key Features

### 1. **Premium Frontend (React + Vite)**
- **Glassmorphism & 3D Effects**: Utilizes `react-parallax-tilt` for a stunning 3D hover effect on profile photos and cards.
- **Dynamic CSS Animations**: Rotating gradient borders, floating particles, and smooth slide-in hamburger menus for mobile.
- **Responsive Design**: 100% mobile-responsive layout ensuring a seamless experience across all devices.
- **Typewriter Effect**: A custom typing animation in the Hero section for a professional elevator pitch.

### 2. **Robust Backend (Express.js Serverless)**
- **API Endpoints**: Fully customized REST API routes (`/api/bio`, `/api/projects`, `/api/skills`, etc.) to dynamically serve portfolio data to the frontend.
- **Nodemailer Integration**: A functional contact form with rate-limiting that sends messages directly to an email inbox and saves them to the database.

### 3. **Secure Admin Panel**
- **JWT-based Authentication**: Secured with JSON Web Tokens (JWT) stored in HttpOnly cookies, completely bypassing the limitations of Vercel serverless environments that break traditional `express-session`.
- **Double-Submit CSRF Protection**: Prevents Cross-Site Request Forgery attacks.
- **Content Management System (CMS)**: The client can log in to `/admin-login` and dynamically update projects, skills, education, and bio text without touching a single line of code.
- **Dashboard Analytics**: Tracks profile views, CV downloads, and unread contact messages in real-time.

### 4. **Cloud Database (Turso libSQL)**
- Shifted from local SQLite (which is ephemeral and resets on Vercel) to **Turso Cloud Database**, ensuring all data (messages, bio, projects) is securely and persistently stored in the cloud.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React.js, Vite, Vanilla CSS (Custom Design System).
- **Backend**: Node.js, Express.js.
- **Database**: Turso Cloud (libSQL), `@libsql/client`.
- **Authentication**: `jsonwebtoken` (JWT), `cookie-parser`.
- **Email Service**: `nodemailer`.
- **Deployment**: Vercel (Frontend & Serverless Functions).

---

## 📖 The Development Process & Journey

### Phase 1: Planning and UI/UX Design
The objective was to create a portfolio that doesn't just look like a standard template, but screams "Premium". We focused on a dark theme with vibrant pink/purple neon accents (`#EC4899`, `#A855F7`). We implemented glassmorphism (`backdrop-filter: blur()`) to give depth to the UI cards and added subtle micro-interactions (hover scales, glows, 3D tilts).

### Phase 2: Building the Dynamic Architecture
Instead of hardcoding data, we built an Express backend to serve data dynamically. We created an Admin Panel so the client could have full ownership. Initially, the database was a local `database.sqlite` file. 

### Phase 3: The Deployment Hurdles (Vercel)
When deploying to Vercel, we encountered two major serverless environment challenges:
1. **Ephemeral File System**: Vercel's serverless functions are read-only. Our local SQLite database was wiped on every request. **Solution**: We migrated the entire database architecture to **Turso Cloud (libSQL)** using connection URLs and auth tokens.
2. **Stateless Functions**: The `express-session` library failed because Vercel spins up new instances for every request, losing session memory and immediately logging the admin out. **Solution**: We completely refactored the authentication system to use **JWT (JSON Web Tokens)** stored securely in `HttpOnly` cookies, ensuring persistent and stateless authentication.

### Phase 4: Mobile Optimization & WOW Effects
Post-deployment, we refined the mobile view by fixing flex/grid layouts, preventing text overlaps, and centering elements. We added a WOW factor to the Hero section with a CSS-animated rotating border, floating sparkles, and a dynamic 3D Tilt container to make the profile picture stand out.

### Phase 5: Final Handover
The footer was updated to properly credit the developer (Huzaifa Shamsi) with a direct WhatsApp contact link. The client was provided credentials to the CMS to take full control of the portfolio content.

---

## ⚙️ Local Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables (`.env`)**:
   Create a `.env` file in the root directory:
   ```env
   TURSO_DATABASE_URL=libsql://your-turso-db-url
   TURSO_AUTH_TOKEN=your-turso-auth-token
   JWT_SECRET=your-very-secure-secret-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-google-app-password
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173` and the backend API will run seamlessly through Vite's proxy.*

---
*If you are looking to build a high-performance, dynamic, and visually stunning web application, [Contact Huzaifa Shamsi on WhatsApp](https://wa.me/923098333185).*
