import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '', honeypot: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.honeypot) return;
        
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all required fields.");
            return;
        }
        
        setIsSubmitting(true);
        const submitPromise = fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send message');
            return data;
        });

        toast.promise(submitPromise, {
            loading: 'Sending message...',
            success: 'Message sent! I\'ll get back to you soon 💜',
            error: err => err.message
        }).then(() => {
            setFormData({ name: '', email: '', message: '', honeypot: '' });
        }).catch(() => {})
          .finally(() => setIsSubmitting(false));
    };

    return (
        <section id="contact" className="contact-section">
            <div className="container">
                <h2 className="section-title reveal">Contact Me</h2>
                
                <div className="contact-grid">
                    <div className="contact-form-wrapper glass-card reveal" style={{ transitionDelay: '0.1s' }}>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Your Name</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="form-control" disabled={isSubmitting} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="form-control" disabled={isSubmitting} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required className="form-control" disabled={isSubmitting}></textarea>
                            </div>
                            <input type="text" name="honeypot" style={{ display: 'none' }} value={formData.honeypot} onChange={handleChange} tabIndex="-1" autoComplete="off" />
                            
                            <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isSubmitting}>
                                <i className="fa-solid fa-paper-plane"></i> {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                    
                    <div className="contact-info-wrapper glass-card reveal" style={{ transitionDelay: '0.2s' }}>
                        <h3>Let's Talk</h3>
                        <p>I'm currently open for internship opportunities, freelance projects, and collaborations. Feel free to reach out!</p>
                        
                        <div className="contact-info-list">
                            <a href="mailto:wajeehaimran86@gmail.com" className="c-info-item">
                                <div className="c-icon"><i className="fa-solid fa-envelope"></i></div>
                                <span>wajeehaimran86@gmail.com</span>
                            </a>
                            <a href="https://wa.me/923016377775" target="_blank" rel="noreferrer" className="c-info-item">
                                <div className="c-icon"><i className="fa-brands fa-whatsapp"></i></div>
                                <span>+92 301 6377775</span>
                            </a>
                            <div className="c-info-item">
                                <div className="c-icon"><i className="fa-solid fa-location-dot"></i></div>
                                <span>Faisalabad, Pakistan</span>
                            </div>
                        </div>
                        
                        <div className="contact-socials">
                            {socials.filter(s => s.is_visible !== 0).map((social, index) => (
                                <a key={index} href={social.url} target="_blank" rel="noreferrer" aria-label={social.platform}>
                                    <i className={social.icon_name}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
