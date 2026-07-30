import { useState, useEffect } from 'react';

const FloatingElements = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isDesktop, setIsDesktop] = useState(true);

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);

        const handleScroll = () => {
            // Scroll Progress
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${(totalScroll / windowHeight) * 100}%`;
            setScrollProgress(scroll);

            // Back to top visibility
            setShowBackToTop(totalScroll > 500);
        };

        const handleMouseMove = (e) => {
            if (isDesktop) {
                setCursorPos({ x: e.clientX, y: e.clientY });
            }
        };

        window.addEventListener('scroll', handleScroll);
        if (isDesktop) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('resize', checkDesktop);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDesktop]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* Scroll Progress Bar */}
            <div className="scroll-progress-container">
                <div className="scroll-progress-bar" style={{ width: scrollProgress }}></div>
            </div>

            {/* Floating Action Buttons */}
            <div className="floating-actions">
                <button 
                    className={`back-to-top ${showBackToTop ? 'visible' : ''}`} 
                    onClick={scrollToTop}
                    aria-label="Back to top"
                >
                    <i className="fa-solid fa-chevron-up"></i>
                </button>
                <a 
                    href="https://wa.me/923016377775" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="floating-whatsapp"
                    aria-label="Chat on WhatsApp"
                >
                    <i className="fa-brands fa-whatsapp"></i>
                </a>
            </div>

            {/* Custom Cursor Glow (Desktop Only) */}
            {isDesktop && (
                <div 
                    className="custom-cursor-glow"
                    style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
                ></div>
            )}
        </>
    );
};

export default FloatingElements;
