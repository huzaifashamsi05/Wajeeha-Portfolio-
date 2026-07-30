import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';

const URL = 'libsql://portfolio-huzaifashamsi05.aws-ap-south-1.turso.io';
const TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODU0MDY1MDMsImlkIjoiMDE5ZmIyODQtNDMwMS03MmVmLThiZWEtMWUyYmVkZGU0YmI5Iiwia2lkIjoiS3J4TDBsa0pJVWpKRGNsWkhkZXpKMFJSVkExOGtCd3UtYXdIYy13OUJXbyIsInJpZCI6ImNlZTg2ZjY0LTI1ODctNDhjNi04MjBlLWI5Yzg4MjAzM2Y4YSJ9.9YxRGHPyR2K_B_KcPqtpnDfsfyr1J4Rx5_OyWb3lPQ-R4X7J6c2iW-aCsCUPw364NPQj85jeSeBGWD1GMnJyBg';

const localDb = new Database('database.db');
const turso = createClient({ url: URL, authToken: TOKEN });

async function fix() {
    await turso.execute('DROP TABLE IF EXISTS analytics');
    await turso.execute(`CREATE TABLE analytics (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        page_views INTEGER DEFAULT 0,
        cv_downloads INTEGER DEFAULT 0,
        contact_submissions INTEGER DEFAULT 0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    const rows = localDb.prepare('SELECT * FROM analytics').all();
    for (const row of rows) {
        const columns = Object.keys(row).join(', ');
        const placeholders = Object.keys(row).map(() => '?').join(', ');
        const values = Object.values(row);
        await turso.execute({
            sql: `INSERT OR IGNORE INTO analytics (${columns}) VALUES (${placeholders})`,
            args: values
        });
    }
    console.log("Analytics fixed!");
}
fix().catch(console.error);
