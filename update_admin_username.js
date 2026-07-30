import { db } from './database.js';
db.prepare('UPDATE settings SET admin_username=? WHERE id=1').run('wajeeha');
console.log('Username updated');
