import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [socials, setSocials] = useState([
        { platform: 'LinkedIn', url: '#', icon_name: 'fa-brands fa-linkedin-in' },
        { platform: 'GitHub', url: '#', icon_name: 'fa-brands fa-github' },
        { platform: 'WhatsApp', url: 'https://wa.me/923016377775', icon_name: 'fa-brands fa-whatsapp' },
        { platform: 'Instagram', url: '#', icon_name: 'fa-brands fa-instagram' },
        { platform: 'YouTube', url: '#', icon_name: 'fa-brands fa-youtube' }
    ]);

    useEffect(() => {
        fetch('/api/social-links')
            .then(res => res.json())
            .then(data => { if (data.length) setSocials(data); })
            .catch(console.error);
    }, []);

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h2>WI.</h2>
                        <p>Building the future with AI & Code</p>
                    </div>
                    
                    <div className="footer-socials">
                        {socials.map((social, idx) => (
                            <a key={idx} href={social.url} target="_blank" rel="noreferrer" aria-label={social.platform}>
                                <i className={social.icon_name}></i>
                            </a>
                        ))}
                    </div>

                    <div className="footer-links">
                        <a href="#home">Home</a>
                        <a href="#about">About</a>
                        <a href="#education">Education</a>
                        <a href="#skills">Skills</a>
                        <a href="#projects">Projects</a>
                        <a href="#resume">Resume</a>
                        <a href="#contact">Contact</a>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p>Made with 💜 by Huzaifa Shamsi <a href="https://wa.me/923098333185" target="_blank" rel="noreferrer" style={{color: 'inherit', margin: '0 5px', textDecoration: 'none'}} aria-label="Contact Developer on WhatsApp"><i className="fa-brands fa-whatsapp"></i></a> {currentYear}</p>
                    <Link to="/admin" className="admin-link">Admin</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
