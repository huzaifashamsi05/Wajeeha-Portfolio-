import { useState, useEffect } from 'react';

const Loader = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setIsLoading(false); // start exit animation
        }, 1800);
        
        const timer2 = setTimeout(() => {
            setIsMounted(false); // unmount after animation finishes
        }, 2500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    if (!isMounted) return null;

    return (
        <div id="loader" className={`loader-container ${!isLoading ? 'slide-up-exit' : ''}`}>
            <div className="loader-content">
                <div className="loader-logo-text">WAJEEHA</div>
                <div className="loader-progress-bar">
                    <div className="loader-progress"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
