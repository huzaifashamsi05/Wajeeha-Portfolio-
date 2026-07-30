import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '../../api';

const SettingsManager = () => {
    const [settings, setSettings] = useState({
        availability_banner_enabled: false,
        banner_text: '',
        site_stats_json: []
    });
    const [passwords, setPasswords] = useState({ current_password: '', new_password: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Fetch public settings endpoint since admin might not have a dedicated GET /settings endpoint in my setup
        // Let's actually fetch from public /api/settings because it returns exactly what we need, or just the same structure
        apiFetch('/api/settings', { method: 'GET' })
            .then(data => {
                setSettings({
                    availability_banner_enabled: data.availability_banner_enabled === 1,
                    banner_text: data.banner_text || '',
                    site_stats_json: data.site_stats_json || []
                });
                setIsLoading(false);
            })
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSettings({ ...settings, [e.target.name]: value });
    };

    const handleStatChange = (index, field, value) => {
        const newStats = [...settings.site_stats_json];
        newStats[index][field] = value;
        setSettings({ ...settings, site_stats_json: newStats });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await apiFetch('/api/admin/settings', {
                method: 'PUT',
                body: settings
            });
            toast.success('Settings saved successfully');
        } catch (err) {
            toast.error(err.message || 'Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        try {
            await apiFetch('/api/admin/settings/password', {
                method: 'PUT',
                body: passwords
            });
            toast.success('Password updated successfully');
            setPasswords({ current_password: '', new_password: '' });
        } catch (err) {
            toast.error(err.message || 'Failed to update password');
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="admin-page-title">Settings</h1>
            
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Site Preferences</h3>
                <form onSubmit={handleSaveSettings}>
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                name="availability_banner_enabled" 
                                checked={settings.availability_banner_enabled}
                                onChange={handleChange}
                                style={{ width: '20px', height: '20px' }}
                            />
                            Enable Availability Banner
                        </label>
                    </div>
                    
                    <div className="form-group" style={{ opacity: settings.availability_banner_enabled ? 1 : 0.5 }}>
                        <label>Banner Text</label>
                        <input 
                            type="text" 
                            name="banner_text" 
                            value={settings.banner_text} 
                            onChange={handleChange} 
                            className="form-control"
                            disabled={!settings.availability_banner_enabled}
                        />
                    </div>

                    <h4 style={{ color: 'var(--text-secondary)', marginTop: '2rem', marginBottom: '1rem' }}>Hero Stat Cards</h4>
                    <div className="stats-grid">
                        {settings.site_stats_json.map((stat, index) => (
                            <div key={index} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                <div className="form-group">
                                    <label>Label</label>
                                    <input type="text" value={stat.label} onChange={(e) => handleStatChange(index, 'label', e.target.value)} className="form-control" />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Value</label>
                                    <input type="text" value={stat.value} onChange={(e) => handleStatChange(index, 'value', e.target.value)} className="form-control" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '2rem' }} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </form>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Change Admin Password</h3>
                <form onSubmit={handleSavePassword}>
                    <div className="form-group">
                        <label>Current Password</label>
                        <input 
                            type="password" 
                            name="current_password" 
                            value={passwords.current_password} 
                            onChange={handlePasswordChange} 
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input 
                            type="password" 
                            name="new_password" 
                            value={passwords.new_password} 
                            onChange={handlePasswordChange} 
                            className="form-control"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-outline">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettingsManager;
