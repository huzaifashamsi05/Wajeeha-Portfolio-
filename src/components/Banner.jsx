import { useState, useEffect } from 'react';

const Banner = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [settings, setSettings] = useState({
        availability_banner_enabled: 1,
        banner_text: "🚀 Currently accepting freelance projects & internship offers!"
    });

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.banner_text) {
                    setSettings(data);
                    if (!data.availability_banner_enabled) setIsVisible(false);
                }
            })
            .catch(err => console.error(err));
    }, []);

    if (!isVisible || !settings.availability_banner_enabled) return null;

    return (
        <div className="availability-banner">
            <span>{settings.banner_text}</span>
            <button className="close-banner" onClick={() => setIsVisible(false)} aria-label="Close banner">
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
};

export default Banner;
