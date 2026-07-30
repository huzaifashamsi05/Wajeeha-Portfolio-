import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '../../api';

const BioManager = () => {
    const [bio, setBio] = useState({
        about_text: '',
        hero_subtitle: '',
        availability_status: '',
        location: '',
        languages: '',
        phone: '',
        email: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        apiFetch('/api/admin/bio', { method: 'GET' })
            .then(data => {
                setBio({
                    about_text: data.about_text || '',
                    hero_subtitle: data.hero_subtitle || '',
                    availability_status: data.availability_status || '',
                    location: data.location || '',
                    languages: data.languages || '',
                    phone: data.phone || '',
                    email: data.email || ''
                });
                setIsLoading(false);
            })
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        setBio({ ...bio, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await apiFetch('/api/admin/bio', {
                method: 'PUT',
                body: bio
            });
            toast.success('Bio updated successfully!');
        } catch (err) {
            toast.error(err.message || 'Failed to update Bio');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="admin-page-title">Bio Editor</h1>
            
            <div className="glass-card" style={{ padding: '2rem' }}>
                <form onSubmit={handleSave}>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}>About Me</label>
                        <textarea 
                            name="about_text"
                            value={bio.about_text} 
                            onChange={handleChange}
                            rows="6"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label>Hero Subtitle</label>
                        <input type="text" name="hero_subtitle" value={bio.hero_subtitle} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Availability Status</label>
                        <input type="text" name="availability_status" value={bio.availability_status} onChange={handleChange} className="form-control" />
                    </div>
                    
                    <div className="stats-grid" style={{ marginBottom: 0 }}>
                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" name="location" value={bio.location} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Languages</label>
                            <input type="text" name="languages" value={bio.languages} onChange={handleChange} className="form-control" />
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="text" name="phone" value={bio.phone} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" name="email" value={bio.email} onChange={handleChange} className="form-control" />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                        {isSaving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-save"></i>} {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BioManager;
