import { db } from './database.js';
db.prepare("UPDATE projects SET live_url=? WHERE title LIKE '%Terminal%'").run('https://wajeehaimran86-gif.github.io/portfolio-terminal/');
console.log('Fixed Live URL');
