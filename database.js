import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('database.db', { verbose: console.log });
db.pragma('journal_mode = WAL');

const initializeDatabase = () => {
    // 1. Bio
    db.exec(`
        CREATE TABLE IF NOT EXISTS bio (
            id INTEGER PRIMARY KEY,
            about_text TEXT,
            hero_subtitle TEXT,
            availability_status TEXT,
            location TEXT,
            languages TEXT,
            phone TEXT,
            email TEXT
        )
    `);

    // 2. Education
    db.exec(`
        CREATE TABLE IF NOT EXISTS education (
            id INTEGER PRIMARY KEY,
            degree TEXT,
            institution TEXT,
            board_or_note TEXT,
            start_year TEXT,
            end_year TEXT,
            description TEXT,
            order_index INTEGER
        )
    `);

    // 3. Skills
    db.exec(`
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY,
            name TEXT,
            category TEXT,
            percentage INTEGER,
            order_index INTEGER
        )
    `);

    // 4. Projects
    db.exec(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY,
            title TEXT,
            category TEXT,
            description TEXT,
            tech_badges TEXT,
            github_url TEXT,
            live_url TEXT,
            status_badge TEXT,
            is_featured BOOLEAN,
            order_index INTEGER
        )
    `);

    // 5. Certifications
    db.exec(`
        CREATE TABLE IF NOT EXISTS certifications (
            id INTEGER PRIMARY KEY,
            title TEXT,
            issuing_org TEXT,
            date TEXT,
            image_url TEXT,
            verify_url TEXT,
            order_index INTEGER
        )
    `);

    // 6. Services
    db.exec(`
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY,
            title TEXT,
            description TEXT,
            icon_name TEXT,
            order_index INTEGER
        )
    `);

    // 7. Testimonials
    db.exec(`
        CREATE TABLE IF NOT EXISTS testimonials (
            id INTEGER PRIMARY KEY,
            name TEXT,
            role TEXT,
            quote TEXT,
            rating INTEGER,
            order_index INTEGER
        )
    `);

    // 8. Social Links
    db.exec(`
        CREATE TABLE IF NOT EXISTS social_links (
            id INTEGER PRIMARY KEY,
            platform TEXT,
            url TEXT,
            icon_name TEXT
        )
    `);

    // 9. Hobbies
    db.exec(`
        CREATE TABLE IF NOT EXISTS hobbies (
            id INTEGER PRIMARY KEY,
            label TEXT,
            icon_emoji TEXT,
            order_index INTEGER
        )
    `);

    // 10. Messages
    db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY,
            name TEXT,
            email TEXT,
            message TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_read BOOLEAN DEFAULT 0
        )
    `);

    // 11. Analytics
    db.exec(`
        CREATE TABLE IF NOT EXISTS analytics (
            id INTEGER PRIMARY KEY,
            page_views INTEGER DEFAULT 0,
            cv_downloads INTEGER DEFAULT 0,
            contact_submissions INTEGER DEFAULT 0,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 12. Settings
    db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY,
            availability_banner_enabled BOOLEAN,
            banner_text TEXT,
            admin_username TEXT,
            admin_password_hash TEXT,
            site_stats_json TEXT
        )
    `);

    seedDatabase();
};

const seedDatabase = () => {
    // Bio
    const bioCount = db.prepare('SELECT COUNT(*) as count FROM bio').get().count;
    if (bioCount === 0) {
        db.prepare(`
            INSERT INTO bio (about_text, hero_subtitle, availability_status, location, languages, phone, email) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            "Hello! I am a 3rd Semester BS Computer Science student at FAST-NUCES, Faisalabad. I am deeply passionate about Machine Learning, Artificial Intelligence, and full-stack development. I enjoy exploring complex algorithms and building systems that solve real-world problems. Welcome to my digital space, where I showcase my journey, projects, and skills as an emerging software engineer and AI enthusiast.",
            "Python Developer | Machine Learning & AI Enthusiast",
            "Available for Internships & Freelance Projects",
            "Faisalabad, Pakistan",
            "English, Urdu, Punjabi",
            "+92 301 6377775",
            "wajeehaimran86@gmail.com"
        );
    }

    // Education
    if (db.prepare('SELECT COUNT(*) as count FROM education').get().count === 0) {
        const insertEdu = db.prepare('INSERT INTO education (degree, institution, board_or_note, start_year, end_year, description, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)');
        insertEdu.run('BS Computer Science', 'National University of Computer and Emerging Sciences (FAST-NUCES)', '', 'Aug 2025', 'Present', 'Currently in my 3rd semester, focusing on core computer science fundamentals, data structures, and algorithms.', 1);
        insertEdu.run('Pre-Engineering (FSc)', 'Punjab Group of Colleges, Gojra', '', '2023', '2025', 'Completed intermediate education with a strong foundation in Mathematics and Physics.', 2);
        insertEdu.run('Matriculation', 'Allied School Higher Secondary Campus, Gojra', '', '2021', '2023', 'Completed secondary education with excellent academic standing.', 3);
    }

    // Skills
    if (db.prepare('SELECT COUNT(*) as count FROM skills').get().count === 0) {
        const insertSkill = db.prepare('INSERT INTO skills (name, category, percentage, order_index) VALUES (?, ?, ?, ?)');
        
        insertSkill.run('Python', 'Languages', 90, 1);
        insertSkill.run('C++', 'Languages', 85, 2);
        insertSkill.run('Java', 'Languages', 75, 3);
        
        insertSkill.run('HTML5', 'Web', 95, 4);
        insertSkill.run('CSS3', 'Web', 90, 5);
        insertSkill.run('JavaScript', 'Web', 80, 6);
        
        insertSkill.run('NumPy', 'Machine Learning', 85, 7);
        insertSkill.run('Pandas', 'Machine Learning', 80, 8);
        insertSkill.run('Matplotlib', 'Machine Learning', 75, 9);
        insertSkill.run('Scikit-Learn', 'Machine Learning', 70, 10);
        
        insertSkill.run('Git & GitHub', 'Tools', 85, 11);
        insertSkill.run('VS Code', 'Tools', 90, 12);
    }

    // Projects
    if (db.prepare('SELECT COUNT(*) as count FROM projects').get().count === 0) {
        const insertProject = db.prepare('INSERT INTO projects (title, category, description, tech_badges, github_url, live_url, status_badge, is_featured, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        
        insertProject.run(
            'Interactive Terminal Portfolio',
            'Web',
            'A developer-inspired terminal-style personal portfolio built using HTML, CSS, and JavaScript — simulating real terminal commands to showcase projects and skills.',
            'HTML5,CSS3,JavaScript',
            '#',
            '#',
            'live',
            1,
            1
        );

        insertProject.run(
            'Fruit Classification Model',
            'Machine Learning',
            'A multi-class machine learning model built to classify different types of fruit images, covering preprocessing, feature extraction, and model evaluation.',
            'Python,Scikit-Learn,NumPy',
            '#',
            null,
            'completed',
            0,
            2
        );

        insertProject.run(
            'Student At-Risk Early Warning System',
            'Machine Learning',
            'A custom machine learning system built from scratch using Poisson Regression, Perceptron, and Naive Bayes to predict student support requests and identify high-risk students for early intervention.',
            'Python,NumPy,Pandas',
            '#',
            null,
            'completed',
            0,
            3
        );

        insertProject.run(
            'Logistic Regression From Scratch',
            'Machine Learning',
            'Complete implementation of logistic regression using Gradient Descent, the Sigmoid Function, and Binary Cross Entropy — built entirely from mathematical foundations without Scikit-Learn\'s built-in model.',
            'Python,NumPy,Matplotlib',
            '#',
            null,
            'completed',
            0,
            4
        );

        insertProject.run(
            'Spam Email Detection Model',
            'Machine Learning',
            'A machine learning project for classifying spam emails using supervised learning techniques.',
            'Python,Scikit-Learn',
            '#',
            null,
            'completed',
            0,
            5
        );

        insertProject.run(
            'Linear Regression Custom',
            'Machine Learning',
            'A custom implementation of linear regression built from scratch in Python to strengthen core understanding of regression algorithms.',
            'Python,NumPy',
            '#',
            null,
            'completed',
            0,
            6
        );

        insertProject.run(
            'CareerCompass AI',
            'Machine Learning',
            'An AI-powered career guidance platform that helps students discover career paths through personalized recommendations, skill roadmaps, and AI-driven insights.',
            'Python,AI/ML',
            '#',
            null,
            'progress',
            0,
            7
        );
    }

    // Social Links
    if (db.prepare('SELECT COUNT(*) as count FROM social_links').get().count === 0) {
        const insertSocial = db.prepare('INSERT INTO social_links (platform, url, icon_name) VALUES (?, ?, ?)');
        insertSocial.run('LinkedIn', '#', 'fa-brands fa-linkedin-in');
        insertSocial.run('GitHub', '#', 'fa-brands fa-github');
        insertSocial.run('WhatsApp', 'https://wa.me/923016377775', 'fa-brands fa-whatsapp');
        insertSocial.run('Instagram', '#', 'fa-brands fa-instagram');
        insertSocial.run('YouTube', '#', 'fa-brands fa-youtube');
    }

    // Hobbies
    if (db.prepare('SELECT COUNT(*) as count FROM hobbies').get().count === 0) {
        const insertHobby = db.prepare('INSERT INTO hobbies (label, icon_emoji, order_index) VALUES (?, ?, ?)');
        insertHobby.run('Reading', 'fa-solid fa-book-open', 1);
        insertHobby.run('Horse Riding', 'fa-solid fa-horse', 2);
        insertHobby.run('Traveling', 'fa-solid fa-plane-departure', 3);
        insertHobby.run('Photography', 'fa-solid fa-camera-retro', 4);
    }

    // Analytics
    if (db.prepare('SELECT COUNT(*) as count FROM analytics').get().count === 0) {
        db.prepare('INSERT INTO analytics (page_views, cv_downloads, contact_submissions) VALUES (0, 0, 0)').run();
    }

    // Settings
    if (db.prepare('SELECT COUNT(*) as count FROM settings').get().count === 0) {
        const hash = bcrypt.hashSync('admin123', 10); // Default admin password
        const statsJson = JSON.stringify([
            { value: "6", label: "Projects Built" },
            { value: "3rd", label: "Semester" },
            { value: "7", label: "Technologies" },
            { value: "20+", label: "GitHub Commits" }
        ]);

        db.prepare(`
            INSERT INTO settings (availability_banner_enabled, banner_text, admin_username, admin_password_hash, site_stats_json) 
            VALUES (?, ?, ?, ?, ?)
        `).run(
            1,
            "🚀 Currently accepting freelance projects & internship offers!",
            "admin",
            hash,
            statsJson
        );
    }

    // Testimonials (Placeholder for now)
    if (db.prepare('SELECT COUNT(*) as count FROM testimonials').get().count === 0) {
        const insertTestimonial = db.prepare('INSERT INTO testimonials (name, role, quote, rating, order_index) VALUES (?, ?, ?, ?, ?)');
        insertTestimonial.run("John Doe", "Software Engineer", "Placeholder testimonial 1.", 5, 1);
        insertTestimonial.run("Jane Smith", "Project Manager", "Placeholder testimonial 2.", 4, 2);
        insertTestimonial.run("Ali Khan", "Client", "Placeholder testimonial 3.", 5, 3);
    }
    
    // Services (Placeholder for now)
    if (db.prepare('SELECT COUNT(*) as count FROM services').get().count === 0) {
        const insertService = db.prepare('INSERT INTO services (title, description, icon_name, order_index) VALUES (?, ?, ?, ?)');
        insertService.run("Web Development", "Building responsive web applications.", "fa-solid fa-code", 1);
        insertService.run("Machine Learning", "Creating AI models.", "fa-solid fa-brain", 2);
        insertService.run("Data Analysis", "Extracting insights from data.", "fa-solid fa-chart-pie", 3);
        insertService.run("Consulting", "Tech consulting and advice.", "fa-solid fa-lightbulb", 4);
    }
};

export { db, initializeDatabase };
