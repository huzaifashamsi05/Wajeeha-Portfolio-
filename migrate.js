import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';

const URL = 'libsql://portfolio-huzaifashamsi05.aws-ap-south-1.turso.io';
const TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODU0MDY1MDMsImlkIjoiMDE5ZmIyODQtNDMwMS03MmVmLThiZWEtMWUyYmVkZGU0YmI5Iiwia2lkIjoiS3J4TDBsa0pJVWpKRGNsWkhkZXpKMFJSVkExOGtCd3UtYXdIYy13OUJXbyIsInJpZCI6ImNlZTg2ZjY0LTI1ODctNDhjNi04MjBlLWI5Yzg4MjAzM2Y4YSJ9.9YxRGHPyR2K_B_KcPqtpnDfsfyr1J4Rx5_OyWb3lPQ-R4X7J6c2iW-aCsCUPw364NPQj85jeSeBGWD1GMnJyBg';

const localDb = new Database('database.db');
const turso = createClient({ url: URL, authToken: TOKEN });

async function migrate() {
    console.log("Starting Migration...");

    // Create Tables
    await turso.execute(`CREATE TABLE IF NOT EXISTS bio (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        about_text TEXT,
        hero_subtitle TEXT,
        availability_status TEXT,
        location TEXT,
        languages TEXT,
        phone TEXT,
        email TEXT
    )`);

    await turso.execute(`CREATE TABLE IF NOT EXISTS education (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        degree TEXT,
        institution TEXT,
        board_or_note TEXT,
        start_year TEXT,
        end_year TEXT,
        description TEXT,
        order_index INTEGER
    )`);

    await turso.execute(`CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        category TEXT,
        percentage INTEGER,
        order_index INTEGER
    )`);

    await turso.execute(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        category TEXT,
        description TEXT,
        tech_badges TEXT,
        github_url TEXT,
        live_url TEXT,
        status_badge TEXT,
        is_featured INTEGER,
        order_index INTEGER
    )`);

    await turso.execute(`CREATE TABLE IF NOT EXISTS certifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        issuing_org TEXT,
        date TEXT,
        image_url TEXT,
        verify_url TEXT,
        order_index INTEGER
    )`);

    await turso.execute(`CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        icon_name TEXT,
        order_index INTEGER
    )`);

    await turso.execute(`CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        role TEXT,
        quote TEXT,
        rating INTEGER,
        order_index INTEGER
    )`);

    await turso.execute(`CREATE TABLE IF NOT EXISTS social_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT,
        url TEXT,
        icon_name TEXT,
        is_visible INTEGER,
        order_index INTEGER
    )`);

    await turso.execute(`CREATE TABLE IF NOT EXISTS hobbies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT,
        icon_emoji TEXT,
        order_index INTEGER
    )`);

    await turso.execute(`CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        admin_username TEXT,
        admin_password_hash TEXT,
        availability_banner_enabled INTEGER DEFAULT 0,
        banner_text TEXT,
        site_stats_json TEXT
    )`);

    await turso.execute(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_read INTEGER DEFAULT 0
    )`);

    await turso.execute(`CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        page_views INTEGER DEFAULT 0,
        cv_downloads INTEGER DEFAULT 0,
        contact_submissions INTEGER DEFAULT 0
    )`);

    console.log("Tables Created.");

    // Migrate Data
    const tables = ['bio', 'education', 'skills', 'projects', 'certifications', 'services', 'testimonials', 'social_links', 'hobbies', 'settings', 'messages', 'analytics'];

    for (const table of tables) {
        console.log(`Migrating ${table}...`);
        const rows = localDb.prepare(`SELECT * FROM ${table}`).all();
        for (const row of rows) {
            const columns = Object.keys(row).join(', ');
            const placeholders = Object.keys(row).map(() => '?').join(', ');
            const values = Object.values(row);
            await turso.execute({
                sql: `INSERT OR IGNORE INTO ${table} (${columns}) VALUES (${placeholders})`,
                args: values
            });
        }
    }

    console.log("Migration Complete!");
}

migrate().catch(console.error);
