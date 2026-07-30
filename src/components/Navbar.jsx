import { useState, useEffect } from 'react';

const Navbar = ({ theme, toggleTheme }) => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            const sections = ['home', 'about', 'education', 'skills', 'projects'];
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i]);
                if (section) {
                    const top = section.offsetTop;
                    if (window.scrollY >= top - 200) {
                        setActiveSection(sections[i]);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav id="navbar" className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                <a href="#home" className="nav-logo">WI</a>
                
                <button 
                    className={`hamburger ${menuOpen ? 'active' : ''}`} 
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                </button>

                <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    {['home', 'about', 'education', 'skills', 'projects'].map((link) => (
                        <li key={link}>
                            <a 
                                href={`#${link}`} 
                                className={activeSection === link ? 'active' : ''}
                                onClick={closeMenu}
                                style={{textTransform: 'capitalize'}}
                            >
                                {link}
                            </a>
                        </li>
                    ))}
                    <li>
                        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Dark/Light Mode">
                            {theme === 'dark' ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
