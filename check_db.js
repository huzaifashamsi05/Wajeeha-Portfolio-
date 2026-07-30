import { db } from './database.js';
console.log(db.prepare('SELECT hero_subtitle FROM bio').get());
