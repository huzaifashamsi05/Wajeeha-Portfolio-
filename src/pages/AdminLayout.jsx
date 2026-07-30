import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch } from '../api';
import '../admin.css';

const AdminLayout = ({ setIsAuthenticated }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch unread messages count
        fetch('/api/admin/analytics')
            .then(res => res.json())
            .then(data => {
                if (data.unread_messages !== undefined) {
                    setUnreadCount(data.unread_messages);
                }
            })
            .catch(() => {});
    }, []);

    const handleLogout = async () => {
        try {
            await apiFetch('/api/admin/logout', { method: 'POST' });
            setIsAuthenticated(false);
            toast.success('Logged out');
            navigate('/admin');
        } catch (err) {
            toast.error('Logout failed');
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const navItems = [
        { path: '/admin/dashboard', icon: 'fa-solid fa-chart-line', label: 'Dashboard' },
        { path: '/admin/messages', icon: 'fa-solid fa-envelope', label: 'Messages', badge: unreadCount },
        { path: '/admin/bio', icon: 'fa-solid fa-user-pen', label: 'Bio Editor' },
        { path: '/admin/education', icon: 'fa-solid fa-graduation-cap', label: 'Education' },
        { path: '/admin/skills', icon: 'fa-solid fa-code', label: 'Skills' },
        { path: '/admin/projects', icon: 'fa-solid fa-folder-open', label: 'Projects' },
        { path: '/admin/certifications', icon: 'fa-solid fa-certificate', label: 'Certifications' },
        { path: '/admin/services', icon: 'fa-solid fa-briefcase', label: 'Services' },
        { path: '/admin/testimonials', icon: 'fa-solid fa-comments', label: 'Testimonials' },
        { path: '/admin/social-links', icon: 'fa-solid fa-hashtag', label: 'Social Links' },
        { path: '/admin/hobbies', icon: 'fa-solid fa-heart', label: 'Hobbies' },
        { path: '/admin/cv', icon: 'fa-solid fa-file-pdf', label: 'CV Manager' },
        { path: '/admin/settings', icon: 'fa-solid fa-gear', label: 'Settings' },
        { path: '/admin/analytics', icon: 'fa-solid fa-chart-pie', label: 'Analytics' }
    ];

    return (
        <div className="admin-layout">
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>WI. Admin</h2>
                </div>
                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <NavLink 
                            to={item.path} 
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            key={item.path}
                            onClick={closeSidebar}
                        >
                            <i className={item.icon}></i>
                            {item.label}
                            {item.badge > 0 && <span className="badge">{item.badge}</span>}
                        </NavLink>
                    ))}
                    <div className="nav-item" onClick={handleLogout} style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <i className="fa-solid fa-sign-out-alt"></i> Logout
                    </div>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <button className="mobile-toggle" onClick={toggleSidebar}>
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <div style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }}>
                        Welcome back, Wajeeha 💜
                    </div>
                </header>
                <div className="admin-content">
                    <Outlet context={{ setUnreadCount }} />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
