import { useState, useEffect } from 'react';
import { apiFetch } from '../../api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsManager = () => {
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

    if (isLoading) return <div>Loading Analytics...</div>;

    // We don't have historical data in the SQLite DB, just totals.
    // So we will just show a static visual representation for demonstration.
    // In a real app, we'd query by date.
    
    const pageViewData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Page Views',
                data: [0, 0, 0, 0, 0, 0, analytics.page_views || 10], // Mocking some growth leading up to current total
                borderColor: '#FF2A85',
                backgroundColor: 'rgba(255, 42, 133, 0.5)',
                tension: 0.4
            }
        ]
    };

    const conversionData = {
        labels: ['Page Views', 'CV Downloads', 'Contact Forms'],
        datasets: [
            {
                label: 'Interactions',
                data: [analytics.page_views, analytics.cv_downloads, analytics.contact_submissions],
                backgroundColor: ['#8A2BE2', '#FF2A85', '#00f0ff'],
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: '#e0e0e0' }
            }
        },
        scales: {
            y: {
                ticks: { color: '#a0a0a0' },
                grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: {
                ticks: { color: '#a0a0a0' },
                grid: { color: 'rgba(255,255,255,0.05)' }
            }
        }
    };

    return (
        <div>
            <h1 className="admin-page-title">Analytics</h1>
            
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
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
            </div>

            <div className="stats-grid">
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Traffic Trend</h3>
                    <Line data={pageViewData} options={options} />
                </div>
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Engagement Funnel</h3>
                    <Bar data={conversionData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsManager;
