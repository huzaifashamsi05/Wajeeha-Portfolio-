import { db } from './database.js';
console.log(db.prepare('SELECT id, admin_username, admin_password_hash FROM settings').get());
