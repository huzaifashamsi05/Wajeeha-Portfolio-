import { useState, useEffect } from 'react';

const Loader = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (!isLoading) return null;

    return (
        <div id="loader" className={!isLoading ? 'hidden' : ''}>
            <div className="loader-logo">WI</div>
        </div>
    );
};

export default Loader;
