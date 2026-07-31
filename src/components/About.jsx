import { useState, useEffect } from 'react';

const About = () => {
    const [bio, setBio] = useState({
        about_text: "Hello! I am a 3rd Semester BS Computer Science student at FAST-NUCES, Faisalabad. I am deeply passionate about Machine Learning, Artificial Intelligence, and full-stack development. I enjoy exploring complex algorithms and building systems that solve real-world problems. Welcome to my digital space, where I showcase my journey, projects, and skills as an emerging software engineer and AI enthusiast.",
        location: "Faisalabad, Pakistan",
        availability_status: "Available for Internships & Freelance Projects",
        phone: "+92 301 6377775",
        email: "wajeehaimran86@gmail.com",
        languages: "English, Urdu, Punjabi"
    });

    useEffect(() => {
        fetch('/api/bio')
            .then(res => res.json())
            .then(data => { if (data.about_text) setBio(data); })
            .catch(console.error);
    }, []);

    return (
        <section id="about" className="about-section">
            <div className="container">
                <h2 className="section-title reveal-stagger">About Me</h2>
                
                <div className="about-content">
                    <div className="about-text-content reveal-stagger">
                        <p className="about-bio">{bio.about_text}</p>
                        
                        <div className="about-info-grid">
                            <div className="info-item glass-card">
                                <div className="info-icon"><i className="fa-solid fa-location-dot"></i></div>
                                <div className="info-text">
                                    <h4>Location</h4>
                                    <p>{bio.location}</p>
                                </div>
                            </div>
                            <div className="info-item glass-card">
                                <div className="info-icon"><i className="fa-solid fa-briefcase"></i></div>
                                <div className="info-text">
                                    <h4>Status</h4>
                                    <p>{bio.availability_status}</p>
                                </div>
                            </div>
                            <div className="info-item glass-card">
                                <div className="info-icon"><i className="fa-solid fa-phone"></i></div>
                                <div className="info-text">
                                    <h4>Phone</h4>
                                    <p>{bio.phone}</p>
                                </div>
                            </div>
                            <div className="info-item glass-card">
                                <div className="info-icon"><i className="fa-solid fa-envelope"></i></div>
                                <div className="info-text">
                                    <h4>Email</h4>
                                    <p>{bio.email}</p>
                                </div>
                            </div>
                        </div>
                        
                        <p className="about-bio mt-3">
                            <strong>Languages:</strong> {bio.languages}
                        </p>
                        
                        <a href="assets/cv.pdf" target="_blank" rel="noreferrer" className="btn btn-primary mt-3" style={{width: 'fit-content'}}>
                            <i className="fa-solid fa-download"></i> Download Resume
                        </a>
                    </div>
                    
                    <div className="about-visuals reveal-stagger">
                        <div className="mini-stats-grid">
                            <div className="mini-stat-card glass-card">
                                <i className="fa-solid fa-code"></i>
                                <h3>7+</h3>
                                <p>Projects Completed</p>
                            </div>
                            <div className="mini-stat-card glass-card">
                                <i className="fa-solid fa-laptop-code"></i>
                                <h3>1.5+</h3>
                                <p>Years of Coding</p>
                            </div>
                            <div className="mini-stat-card glass-card">
                                <i className="fa-solid fa-rocket"></i>
                                <h3>3.5+</h3>
                                <p>CGPA Expected</p>
                            </div>
                            <div className="mini-stat-card glass-card">
                                <i className="fa-solid fa-certificate"></i>
                                <h3>0</h3>
                                <p>Certifications</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="currently-building-wrapper reveal-stagger">
                    <div className="building-card glass-card">
                        <div className="building-badge">
                            <i className="fa-solid fa-fire"></i> In Progress
                        </div>
                        <div className="building-content">
                            <h3><i className="fa-solid fa-rocket"></i> CareerCompass AI</h3>
                            <p>An AI-powered career guidance platform that helps students discover career paths through personalized recommendations, skill roadmaps, and AI-driven insights.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
