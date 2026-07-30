import { db } from './database.js';
db.prepare("UPDATE projects SET live_url='#' WHERE title LIKE '%Terminal%'").run();
console.log('Reset Live URL to #');
