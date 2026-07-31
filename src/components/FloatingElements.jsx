import { useState, useEffect } from 'react';

const FloatingElements = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isDesktop, setIsDesktop] = useState(true);
    const [trail, setTrail] = useState([]);

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
                setTrail(prev => {
                    const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() + Math.random() }];
                    if (newTrail.length > 8) newTrail.shift();
                    return newTrail;
                });
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

    // Clear trail on interval to simulate fading when stopped
    useEffect(() => {
        if (!isDesktop) return;
        const interval = setInterval(() => {
            setTrail(prev => (prev.length > 0 ? prev.slice(1) : []));
        }, 50);
        return () => clearInterval(interval);
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

            {/* Full Custom Cursor (Desktop Only) */}
            {isDesktop && (
                <>
                    {trail.map((t, index) => (
                        <div 
                            key={t.id}
                            className="cursor-trail-dot"
                            style={{ 
                                left: `${t.x}px`, 
                                top: `${t.y}px`,
                                opacity: (index + 1) / trail.length,
                                transform: `translate(-50%, -50%) scale(${(index + 1) / trail.length})`
                            }}
                        ></div>
                    ))}
                    <div 
                        className="cursor-dot"
                        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
                    ></div>
                    <div 
                        className="cursor-outline"
                        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
                    ></div>
                    <div 
                        className="custom-cursor-glow"
                        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
                    ></div>
                </>
            )}
        </>
    );
};

export default FloatingElements;
