import { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';

const Hero = ({ theme }) => {
    const [bio, setBio] = useState({
        hero_subtitle: "Python Developer | Machine Learning & AI Enthusiast",
        about_text: "Hello! I am a 3rd Semester BS Computer Science student at FAST-NUCES, Faisalabad. I am deeply passionate about Machine Learning, Artificial Intelligence, and full-stack development. I enjoy exploring complex algorithms and building systems that solve real-world problems. Welcome to my digital space, where I showcase my journey, projects, and skills as an emerging software engineer and AI enthusiast."
    });

    const [socials, setSocials] = useState([
        { platform: 'LinkedIn', url: '#', icon_name: 'fa-brands fa-linkedin-in' },
        { platform: 'GitHub', url: '#', icon_name: 'fa-brands fa-github' },
        { platform: 'WhatsApp', url: 'https://wa.me/923016377775', icon_name: 'fa-brands fa-whatsapp' },
        { platform: 'Instagram', url: '#', icon_name: 'fa-brands fa-instagram' },
        { platform: 'YouTube', url: '#', icon_name: 'fa-brands fa-youtube' }
    ]);

    const [stats, setStats] = useState([
        { value: "6", label: "Projects Built" },
        { value: "3rd", label: "Semester" },
        { value: "7", label: "Technologies" },
        { value: "20+", label: "GitHub Commits" }
    ]);

    const [displayedSubtitle, setDisplayedSubtitle] = useState('');

    useEffect(() => {
        fetch('/api/bio')
            .then(res => res.json())
            .then(data => { if (data.hero_subtitle) setBio(data); })
            .catch(console.error);

        fetch('/api/social-links')
            .then(res => res.json())
            .then(data => { if (data.length) setSocials(data); })
            .catch(console.error);
            
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => { if (data.site_stats_json) setStats(data.site_stats_json); })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!bio.hero_subtitle) return;
        
        const phrases = bio.hero_subtitle.split('|').map(s => s.trim()).filter(Boolean);
        if (phrases.length === 0) return;

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeout;
        
        const typeWriter = () => {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                setDisplayedSubtitle(currentPhrase.substring(0, charIndex - 1));
                charIndex--;
            } else {
                setDisplayedSubtitle(currentPhrase.substring(0, charIndex + 1));
                charIndex++;
            }
            
            let typeSpeed = 100;
            if (isDeleting) typeSpeed /= 2;
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500; // Pause before start
            }
            
            timeout = setTimeout(typeWriter, typeSpeed);
        };
        
        timeout = setTimeout(typeWriter, 500);
        
        return () => clearTimeout(timeout);
    }, [bio.hero_subtitle]);

    return (
        <section id="home" className="hero">
            <div id="particles-js"></div>
            <div className="container">
                <div className="hero-content">
                    <div className="hero-text reveal-stagger">
                        <h3>Hi there, I'm Wajeeha 👋</h3>
                        <h1>Wajeeha Imran</h1>
                        <div className="typewriter-container">
                            <span id="typewriter">{displayedSubtitle}</span><span className="cursor"></span>
                        </div>
                        
                        <div className="hero-buttons">
                            <a href="#projects" className="btn btn-primary">View My Work</a>
                            <a href="#contact" className="btn btn-outline">Let's Connect</a>
                        </div>
                        
                        <div className="hero-socials">
                            {socials.map((social, index) => (
                                <a key={index} href={social.url} target="_blank" rel="noreferrer" aria-label={social.platform}>
                                    <i className={social.icon_name}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    <div className="hero-image-container reveal">
                        <Tilt 
                            tiltMaxAngleX={10} 
                            tiltMaxAngleY={10} 
                            perspective={1000} 
                            scale={1.05} 
                            transitionSpeed={2000}
                            glareEnable={true}
                            glareMaxOpacity={0.2}
                            glareColor="var(--accent-glow)"
                            glarePosition="all"
                        >
                            <div className="hero-image-wrapper">
                                <div className="animated-border"></div>
                                <img src="assets/profile.jpg" alt="Wajeeha Imran" className="hero-image" />
                                <div className="floating-sparkle sp-1"><i className="fa-solid fa-star"></i></div>
                                <div className="floating-sparkle sp-2"><i className="fa-solid fa-sparkles"></i></div>
                                <div className="floating-sparkle sp-3"><i className="fa-solid fa-heart"></i></div>
                            </div>
                        </Tilt>
                    </div>
                </div>
                
                <div className="hero-stats-bar reveal-stagger">
                    {stats.map((stat, index) => (
                        <div className="stat-card glass-card" key={index}>
                            <div className="stat-number">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
                
                <a href="#about" className="scroll-down">
                    <span>Scroll</span>
                    <i className="fa-solid fa-chevron-down"></i>
                </a>
            </div>
        </section>
    );
};

export default Hero;
