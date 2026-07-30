import { db } from './database.js';

const run = () => {
    try {
        db.exec('ALTER TABLE social_links ADD COLUMN is_visible BOOLEAN DEFAULT 1');
        console.log('Added is_visible to social_links');
    } catch(e) {
        console.log(e.message);
    }
};
run();
