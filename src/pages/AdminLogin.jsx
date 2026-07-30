import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch, fetchCsrfToken } from '../api';
import '../admin.css';

const AdminLogin = ({ setIsAuthenticated }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCsrfToken();
        // Check if already authenticated
        fetch('/api/admin/check-auth')
            .then(res => res.json())
            .then(data => {
                if (data.authenticated) {
                    setIsAuthenticated(true);
                    navigate('/admin/dashboard');
                }
            })
            .catch(() => {});
    }, [navigate, setIsAuthenticated]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await apiFetch('/api/admin/login', {
                method: 'POST',
                body: credentials
            });
            
            setIsAuthenticated(true);
            toast.success('Welcome back, Wajeeha 💜');
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error(err.message || 'Login failed');
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div id="particles-js" className="particles-bg"></div>
            <div className={`login-card glass-card ${shake ? 'shake-animation' : ''}`}>
                <div className="login-header">
                    <h2>Admin Portal</h2>
                    <p>Enter your credentials to access the dashboard.</p>
                </div>
                
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            value={credentials.username} 
                            onChange={handleChange} 
                            className="form-control"
                            required 
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={credentials.password} 
                            onChange={handleChange} 
                            className="form-control"
                            required 
                            disabled={isLoading}
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                        {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Login to Dashboard'}
                    </button>
                </form>
                
                <a href="/" className="back-link"><i className="fa-solid fa-arrow-left"></i> Back to Portfolio</a>
            </div>
        </div>
    );
};

export default AdminLogin;
