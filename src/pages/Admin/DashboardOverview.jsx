import { useState, useEffect } from 'react';
import { apiFetch } from '../../api';

const DashboardOverview = () => {
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        apiFetch('/api/admin/analytics', { method: 'GET' })
            .then(data => {
                setAnalytics(data);
                setIsLoading(false);
            })
            .catch(console.error);
    }, []);

    if (isLoading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <h1 className="admin-page-title">Dashboard Overview</h1>
            
            <div className="stats-grid">
                <div className="stat-box glass-card">
                    <i className="fa-solid fa-eye"></i>
                    <h4>Total Page Views</h4>
                    <h2>{analytics.page_views || 0}</h2>
                </div>
                <div className="stat-box glass-card">
                    <i className="fa-solid fa-file-pdf"></i>
                    <h4>CV Downloads</h4>
                    <h2>{analytics.cv_downloads || 0}</h2>
                </div>
                <div className="stat-box glass-card">
                    <i className="fa-solid fa-envelope"></i>
                    <h4>Contact Submissions</h4>
                    <h2>{analytics.contact_submissions || 0}</h2>
                </div>
                <div className="stat-box glass-card" style={{ border: analytics.unread_messages > 0 ? '1px solid var(--secondary-color)' : '' }}>
                    <i className="fa-solid fa-bell" style={{ color: analytics.unread_messages > 0 ? 'var(--secondary-color)' : 'var(--text-secondary)' }}></i>
                    <h4>Unread Messages</h4>
                    <h2>{analytics.unread_messages || 0}</h2>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Recent Activity</h3>
                {analytics.recent_messages && analytics.recent_messages.length > 0 ? (
                    <div className="recent-messages-list">
                        {analytics.recent_messages.map(msg => (
                            <div key={msg.id} style={{
                                padding: '1rem',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <strong style={{ color: msg.is_read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                                        {msg.name} {msg.is_read ? '' : <span className="badge" style={{marginLeft:'10px', background:'var(--secondary-color)', padding:'2px 8px', borderRadius:'10px', fontSize:'0.7rem'}}>NEW</span>}
                                    </strong>
                                    <p style={{ margin: '0.2rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {msg.message.substring(0, 60)}...
                                    </p>
                                </div>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                    {new Date(msg.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>No recent activity to show.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardOverview;
