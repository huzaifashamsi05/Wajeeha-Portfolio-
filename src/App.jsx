import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Portfolio from './pages/Portfolio';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/AdminLayout';

// Admin Components
import DashboardOverview from './pages/Admin/DashboardOverview';
import MessagesManager from './pages/Admin/MessagesManager';
import BioManager from './pages/Admin/BioManager';
import ListManager from './pages/Admin/ListManager';
import SocialLinksManager from './pages/Admin/SocialLinksManager';
import CVManager from './pages/Admin/CVManager';
import SettingsManager from './pages/Admin/SettingsManager';
import AnalyticsManager from './pages/Admin/AnalyticsManager';

function App() {
  const [theme, setTheme] = useState('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    fetch('/api/track-pageview', { method: 'POST' }).catch(console.error);
    const handleScroll = () => {
        const revealElements = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        const isMobile = window.innerWidth < 768;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = isMobile ? 50 : 100;
            if (elementTop < windowHeight - elementVisible) el.classList.add('active');
        });
    };
    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ProtectedRoute = ({ children }) => {
      if (!isAuthenticated) return <Navigate to="/admin" />;
      return children;
  };

  return (
    <Router>
      <Toaster position="bottom-right" toastOptions={{
        style: { background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-soft)' }
      }} />
      <Routes>
        <Route path="/" element={<Portfolio theme={theme} toggleTheme={toggleTheme} />} />
        
        <Route path="/admin" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
        
        <Route path="/admin/*" element={
            <ProtectedRoute>
                <AdminLayout setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
        }>
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="bio" element={<BioManager />} />
            
            <Route path="education" element={
                <ListManager 
                    title="Education Manager" 
                    endpoint="education"
                    fields={[
                        { name: 'degree', label: 'Degree', required: true },
                        { name: 'institution', label: 'Institution', required: true },
                        { name: 'board_or_note', label: 'Board or Note' },
                        { name: 'start_year', label: 'Start Year', required: true },
                        { name: 'end_year', label: 'End Year', required: true },
                        { name: 'description', label: 'Description', type: 'textarea' }
                    ]}
                    itemRenderer={(item) => (
                        <><h4>{item.degree}</h4><p>{item.institution} ({item.start_year} - {item.end_year})</p></>
                    )}
                />
            } />
            
            <Route path="skills" element={
                <ListManager 
                    title="Skills Manager" 
                    endpoint="skills"
                    fields={[
                        { name: 'name', label: 'Skill Name', required: true },
                        { name: 'category', label: 'Category (Languages/Web/Machine Learning/Tools)', required: true },
                        { name: 'percentage', label: 'Percentage (0-100)', type: 'number', required: true }
                    ]}
                    itemRenderer={(item) => (
                        <><h4>{item.name}</h4><p>{item.category} &bull; {item.percentage}%</p></>
                    )}
                />
            } />
            
            <Route path="projects" element={
                <ListManager 
                    title="Projects Manager" 
                    endpoint="projects"
                    fields={[
                        { name: 'title', label: 'Project Title', required: true },
                        { name: 'category', label: 'Category', required: true },
                        { name: 'description', label: 'Description', type: 'textarea', required: true },
                        { name: 'tech_badges', label: 'Tech Badges (comma separated)', required: true },
                        { name: 'github_url', label: 'GitHub URL' },
                        { name: 'live_url', label: 'Live Demo URL' },
                        { name: 'status_badge', label: 'Status (live/completed/progress)', required: true },
                        { name: 'is_featured', label: 'Featured', type: 'checkbox', checkboxLabel: 'Show large on frontend' }
                    ]}
                    itemRenderer={(item) => (
                        <><h4>{item.title}</h4><p>{item.category} &bull; Status: {item.status_badge}</p></>
                    )}
                />
            } />

            <Route path="certifications" element={
                <ListManager 
                    title="Certifications Manager" 
                    endpoint="certifications"
                    fields={[
                        { name: 'title', label: 'Title', required: true },
                        { name: 'issuing_org', label: 'Issuing Organization', required: true },
                        { name: 'date', label: 'Date' },
                        { name: 'image_url', label: 'Image URL' },
                        { name: 'verify_url', label: 'Verify URL' }
                    ]}
                    itemRenderer={(item) => (
                        <><h4>{item.title}</h4><p>{item.issuing_org} ({item.date})</p></>
                    )}
                />
            } />

            <Route path="services" element={
                <ListManager 
                    title="Services Manager" 
                    endpoint="services"
                    fields={[
                        { name: 'title', label: 'Service Title', required: true },
                        { name: 'description', label: 'Description', type: 'textarea', required: true },
                        { name: 'icon_name', label: 'FontAwesome Icon Class (e.g. fa-solid fa-code)', required: true }
                    ]}
                    itemRenderer={(item) => (
                        <><h4><i className={item.icon_name} style={{marginRight:'10px'}}></i>{item.title}</h4><p>{item.description}</p></>
                    )}
                />
            } />

            <Route path="testimonials" element={
                <ListManager 
                    title="Testimonials Manager" 
                    endpoint="testimonials"
                    fields={[
                        { name: 'name', label: 'Reviewer Name', required: true },
                        { name: 'role', label: 'Role/Company', required: true },
                        { name: 'quote', label: 'Quote', type: 'textarea', required: true },
                        { name: 'rating', label: 'Rating (1-5)', type: 'number', required: true }
                    ]}
                    itemRenderer={(item) => (
                        <><h4>{item.name}</h4><p>{item.role} &bull; {item.rating} Stars</p></>
                    )}
                />
            } />

            <Route path="hobbies" element={
                <ListManager 
                    title="Hobbies Manager" 
                    endpoint="hobbies"
                    fields={[
                        { name: 'label', label: 'Hobby Label', required: true },
                        { name: 'icon_emoji', label: 'FontAwesome Icon Class', required: true }
                    ]}
                    itemRenderer={(item) => (
                        <><h4><i className={item.icon_emoji} style={{marginRight:'10px'}}></i>{item.label}</h4></>
                    )}
                />
            } />

            <Route path="social-links" element={<SocialLinksManager />} />
            <Route path="cv" element={<CVManager />} />
            <Route path="settings" element={<SettingsManager />} />
            <Route path="analytics" element={<AnalyticsManager />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
