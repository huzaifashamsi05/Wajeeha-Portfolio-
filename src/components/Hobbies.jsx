import { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';

const Hobbies = () => {
    const [hobbies, setHobbies] = useState([
        { label: "Reading", icon_emoji: "fa-solid fa-book-open" },
        { label: "Horse Riding", icon_emoji: "fa-solid fa-horse" },
        { label: "Traveling", icon_emoji: "fa-solid fa-plane-departure" },
        { label: "Photography", icon_emoji: "fa-solid fa-camera-retro" }
    ]);

    useEffect(() => {
        fetch('/api/hobbies')
            .then(res => res.json())
            .then(data => { if (data.length) setHobbies(data); })
            .catch(console.error);
    }, []);

    return (
        <section id="hobbies" className="hobbies-section">
            <div className="container">
                <h2 className="section-title reveal">Interests & Hobbies</h2>
                
                <div className="hobbies-grid">
                    {hobbies.map((hobby, index) => (
                        <Tilt
                            key={hobby.label || hobby.id}
                            className="hobby-tilt reveal"
                            style={{ transitionDelay: `${index * 0.1}s` }}
                            tiltMaxAngleX={15}
                            tiltMaxAngleY={15}
                            glareEnable={true}
                            glareMaxOpacity={0.2}
                            scale={1.05}
                        >
                            <div className="hobby-card glass-card">
                                <div className="hobby-icon-wrapper">
                                    <i className={hobby.icon_emoji}></i>
                                </div>
                                <h4>{hobby.label}</h4>
                            </div>
                        </Tilt>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hobbies;
