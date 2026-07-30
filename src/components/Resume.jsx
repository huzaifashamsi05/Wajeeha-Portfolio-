import Tilt from 'react-parallax-tilt';

const Resume = () => {
    const handleDownload = () => {
        fetch('/api/track-cv-download', { method: 'POST' }).catch(console.error);
    };

    return (
        <section id="resume" className="resume-section">
            <div className="container">
                <h2 className="section-title reveal">Resume / CV</h2>
                
                <div className="reveal" style={{ display: 'flex', justifyContent: 'center' }}>
                    <Tilt 
                        className="resume-card-tilt"
                        tiltMaxAngleX={5} 
                        tiltMaxAngleY={5} 
                        perspective={1000} 
                        scale={1.02} 
                        transitionSpeed={2000}
                        glareEnable={true}
                        glareMaxOpacity={0.15}
                        glareColor="white"
                        glarePosition="all"
                        style={{ width: '100%', maxWidth: '800px' }}
                    >
                        <div className="resume-card glass-card">
                            <div className="resume-header">
                                <img src="assets/profile.jpg" alt="Wajeeha Imran" className="resume-avatar" />
                                <div className="resume-title-group">
                                    <h3>Wajeeha Imran</h3>
                                    <p>BS Computer Science Student & AI/ML Enthusiast</p>
                                </div>
                            </div>
                            
                            <div className="resume-stats">
                                <div className="r-stat">
                                    <i className="fa-solid fa-graduation-cap"></i>
                                    <span><strong>Education:</strong> FAST-NUCES, 3rd Semester</span>
                                </div>
                                <div className="r-stat">
                                    <i className="fa-solid fa-screwdriver-wrench"></i>
                                    <span><strong>Key Skills:</strong> Python, Scikit-Learn, Machine Learning</span>
                                </div>
                                <div className="r-stat">
                                    <i className="fa-solid fa-certificate"></i>
                                    <span><strong>Certifications:</strong> Coming Soon</span>
                                </div>
                            </div>
                            
                            <div className="resume-action">
                                <a href="assets/cv.pdf" target="_blank" rel="noreferrer" className="btn btn-primary btn-large" onClick={handleDownload}>
                                    <i className="fa-solid fa-file-pdf"></i> Download CV (PDF)
                                </a>
                                <p className="last-updated">Last updated: July 2026</p>
                            </div>
                        </div>
                    </Tilt>
                </div>
            </div>
        </section>
    );
};

export default Resume;
