import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '../../api';
import { useOutletContext } from 'react-router-dom';

const MessagesManager = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const { setUnreadCount } = useOutletContext(); // To update sidebar badge

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const data = await apiFetch('/api/admin/messages', { method: 'GET' });
            setMessages(data);
            setIsLoading(false);
            
            // Update unread count context
            const unread = data.filter(m => !m.is_read).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRead = async (id, isRead) => {
        if (isRead) return; // Already read
        try {
            await apiFetch(`/api/admin/messages/${id}/read`, { method: 'PUT' });
            setMessages(messages.map(m => m.id === id ? { ...m, is_read: 1 } : m));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            toast.error('Failed to mark as read');
        }
    };

    const toggleExpand = (id, isRead) => {
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
            handleRead(id, isRead);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await apiFetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
            setMessages(messages.filter(m => m.id !== id));
            toast.success('Message deleted');
        } catch (err) {
            toast.error('Failed to delete message');
        }
    };

    if (isLoading) return <div>Loading messages...</div>;

    return (
        <div>
            <h1 className="admin-page-title">Inbox</h1>
            
            {messages.length === 0 ? (
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <i className="fa-solid fa-inbox" style={{ fontSize: '3rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}></i>
                    <h3>No messages yet</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>When visitors contact you, their messages will appear here.</p>
                </div>
            ) : (
                <div className="messages-list">
                    {messages.map(msg => (
                        <div key={msg.id} className="glass-card" style={{ 
                            marginBottom: '1rem', 
                            borderLeft: msg.is_read ? 'none' : '4px solid var(--secondary-color)',
                            transition: 'var(--transition-smooth)'
                        }}>
                            <div 
                                style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                onClick={() => toggleExpand(msg.id, msg.is_read)}
                            >
                                <div>
                                    <h4 style={{ color: msg.is_read ? 'var(--text-primary)' : 'var(--accent-glow)', marginBottom: '0.2rem' }}>
                                        {msg.name} {!msg.is_read && <span className="badge" style={{background:'var(--secondary-color)', padding:'2px 8px', borderRadius:'10px', fontSize:'0.7rem', marginLeft:'10px', color:'white'}}>NEW</span>}
                                    </h4>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        <i className="fa-solid fa-envelope"></i> {msg.email} | {new Date(msg.timestamp).toLocaleString()}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <i className={`fa-solid fa-chevron-${expandedId === msg.id ? 'up' : 'down'}`} style={{ color: 'var(--text-secondary)' }}></i>
                                    <button 
                                        className="btn-icon delete" 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                                        title="Delete Message"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            
                            {expandedId === msg.id && (
                                <div style={{ 
                                    padding: '1.5rem', 
                                    borderTop: '1px solid rgba(255,255,255,0.05)',
                                    background: 'rgba(0,0,0,0.2)',
                                    whiteSpace: 'pre-wrap',
                                    color: 'var(--text-primary)'
                                }}>
                                    {msg.message}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessagesManager;
