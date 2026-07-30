import { db } from './database.js';
import bcrypt from 'bcryptjs';

const run = () => {
    try {
        // Reset Admin Password
        const hash = bcrypt.hashSync('wajeeha401', 10);
        db.prepare('UPDATE settings SET admin_password_hash = ? WHERE id = 1').run(hash);
        console.log('Password reset successfully');

        // Fix Project URLs
        db.prepare('UPDATE projects SET github_url = ?').run('https://github.com/wajeehaimran86-gif');
        
        // Fix CareerCompass AI to be 'completed' so it doesn't show the "In Progress" badge (which she called a weird pink oval)
        db.prepare("UPDATE projects SET status_badge = 'completed' WHERE title LIKE '%CareerCompass%'").run();
        
        console.log('Fixed projects');
    } catch(e) {
        console.error(e);
    }
};

run();
