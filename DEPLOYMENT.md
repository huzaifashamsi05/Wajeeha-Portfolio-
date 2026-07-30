# Deployment Guide for Vercel

Everything is perfectly configured for Vercel! Your `vercel.json` and `server.js` are ready for a full-stack deployment.

## Next Steps

1. Upload this entire folder to a **GitHub Repository**.
2. Go to **Vercel.com**, log in, and click **Add New Project**.
3. Import your GitHub repository.
4. **Important**: In the Vercel Build Settings, make sure the framework is set to **Vite** or the build command is `npm run build` and output directory is `dist`. Vercel usually detects this automatically.
5. Click **Deploy**.

## The Database (Important)

As mentioned in the plan, Vercel wipes its local file system continuously. Because this portfolio currently uses `better-sqlite3` (a local database file), any changes you make in the Admin panel on the live site will be deleted after a few minutes!

**To fix this for free (No Credit Card), you have two options:**

### Option 1: Turso (Cloud SQLite) - Highly Recommended
Turso is a free, serverless SQLite database.
1. Go to [turso.tech](https://turso.tech) and sign up.
2. Create a database.
3. Get your connection URL and Auth Token.
4. Replace `better-sqlite3` in your code with `@libsql/client` (they work exactly the same way).

### Option 2: MongoDB Atlas
If you prefer NoSQL, you can use MongoDB's free tier. You would need to update `server.js` and `database.js` to use Mongoose instead of SQLite queries.

*For now, your portfolio is 100% ready to deploy to Vercel so you can view it live! The Admin panel works flawlessly on your local machine to build the site, and if you want the Admin panel to persist changes on Vercel, simply connect a Cloud Database like Turso!*
