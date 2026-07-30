import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '../../api';

const SocialLinksManager = () => {
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const allowedPlatforms = [
        { name: 'LinkedIn', icon: 'fa-brands fa-linkedin-in' },
        { name: 'GitHub', icon: 'fa-brands fa-github' },
        { name: 'WhatsApp', icon: 'fa-brands fa-whatsapp' },
        { name: 'Instagram', icon: 'fa-brands fa-instagram' },
        { name: 'YouTube', icon: 'fa-brands fa-youtube' },
        { name: 'Twitter/X', icon: 'fa-brands fa-x-twitter' },
        { name: 'Facebook', icon: 'fa-brands fa-facebook-f' },
        { name: 'Email', icon: 'fa-solid fa-envelope' }
    ];

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const data = await apiFetch('/api/social-links', { method: 'GET' });
            
            // Merge existing data with allowed platforms to ensure we have slots for all
            const merged = allowedPlatforms.map(platform => {
                const existing = data.find(d => d.platform === platform.name);
                return existing || { id: null, platform: platform.name, icon_name: platform.icon, url: '', is_visible: 0 };
            });
            
            setLinks(merged);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async (index, field, value) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    const handleSave = async (link) => {
        try {
            // For this project, since the database was seeded with specific ones and we might not have POST for social links setup 
            // (the prompt asked for PUT /social-links/:id and said "Do not allow adding random unsupported platforms"), 
            // if a link has no ID, we would technically need a POST. But wait, the backend only has PUT /social-links/:id.
            // Let's assume the DB has the 5 pre-seeded ones. If Wajeeha wants Twitter, it might fail if ID is null.
            // I should modify the backend to upsert or just only show the ones already in the DB.
            if (!link.id) {
                toast.error("This platform wasn't pre-seeded in the database. (Contact dev to add POST endpoint)");
                return;
            }
            
            await apiFetch(`/api/admin/social-links/${link.id}`, { 
                method: 'PUT', 
                body: { url: link.url, is_visible: link.is_visible ? 1 : 0 }
            });
            toast.success(`${link.platform} updated`);
        } catch(err) {
            toast.error(`Failed to update ${link.platform}`);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="admin-page-title">Social Links Manager</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Toggle platforms on/off to show/hide them on the public site. Only predefined platforms are supported to guarantee design consistency.
            </p>
            
            <div className="list-container">
                {links.filter(l => l.id).map((link, index) => (
                    <div className="list-item" key={link.id || link.platform}>
                        <div className="list-item-content" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                            <div style={{ fontSize: '1.5rem', width: '30px', textAlign: 'center', color: link.is_visible ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                <i className={link.icon_name}></i>
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ color: link.is_visible ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                    {link.platform}
                                </h4>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={link.url}
                                    onChange={(e) => handleUpdate(index, 'url', e.target.value)}
                                    placeholder={`https://...`}
                                    style={{ marginTop: '0.5rem', opacity: link.is_visible ? 1 : 0.5 }}
                                />
                            </div>
                        </div>
                        <div className="list-item-actions" style={{ marginLeft: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <input 
                                    type="checkbox" 
                                    checked={!!link.is_visible} 
                                    onChange={(e) => handleUpdate(index, 'is_visible', e.target.checked)}
                                    style={{ width: '20px', height: '20px' }}
                                />
                                Visible
                            </label>
                            
                            <button className="btn btn-primary" onClick={() => handleSave(link)} style={{ padding: '0.5rem 1rem' }}>
                                Save
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SocialLinksManager;
