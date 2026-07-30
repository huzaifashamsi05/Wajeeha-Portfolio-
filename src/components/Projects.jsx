import { useState, useEffect } from 'react';

const Projects = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    
    const [projectsData, setProjectsData] = useState([
        {
            id: 1,
            title: "Interactive Terminal Portfolio",
            category: "Web",
            description: "A developer-inspired terminal-style personal portfolio built using HTML, CSS, and JavaScript — simulating real terminal commands to showcase projects and skills.",
            tech_badges: "HTML5,CSS3,JavaScript",
            github_url: "#",
            live_url: "#",
            status_badge: "live",
            is_featured: 1
        },
        {
            id: 2,
            title: "Fruit Classification Model",
            category: "Machine Learning",
            description: "A multi-class machine learning model built to classify different types of fruit images, covering preprocessing, feature extraction, and model evaluation.",
            tech_badges: "Python,Scikit-Learn,NumPy",
            github_url: "#",
            live_url: null,
            status_badge: "completed",
            is_featured: 0
        },
        {
            id: 3,
            title: "Student At-Risk Early Warning System",
            category: "Machine Learning",
            description: "A custom machine learning system built from scratch using Poisson Regression, Perceptron, and Naive Bayes to predict student support requests and identify high-risk students for early intervention.",
            tech_badges: "Python,NumPy,Pandas",
            github_url: "#",
            live_url: null,
            status_badge: "completed",
            is_featured: 0
        },
        {
            id: 4,
            title: "Logistic Regression From Scratch",
            category: "Machine Learning",
            description: "Complete implementation of logistic regression using Gradient Descent, the Sigmoid Function, and Binary Cross Entropy — built entirely from mathematical foundations without Scikit-Learn's built-in model.",
            tech_badges: "Python,NumPy,Matplotlib",
            github_url: "#",
            live_url: null,
            status_badge: "completed",
            is_featured: 0
        },
        {
            id: 5,
            title: "Spam Email Detection Model",
            category: "Machine Learning",
            description: "A machine learning project for classifying spam emails using supervised learning techniques.",
            tech_badges: "Python,Scikit-Learn",
            github_url: "#",
            live_url: null,
            status_badge: "completed",
            is_featured: 0
        },
        {
            id: 6,
            title: "Linear Regression Custom",
            category: "Machine Learning",
            description: "A custom implementation of linear regression built from scratch in Python to strengthen core understanding of regression algorithms.",
            tech_badges: "Python,NumPy",
            github_url: "#",
            live_url: null,
            status_badge: "completed",
            is_featured: 0
        },
        {
            id: 7,
            title: "CareerCompass AI",
            category: "Machine Learning",
            description: "An AI-powered career guidance platform that helps students discover career paths through personalized recommendations, skill roadmaps, and AI-driven insights.",
            tech_badges: "Python,AI/ML",
            github_url: "#",
            live_url: null,
            status_badge: "progress",
            is_featured: 0
        }
    ]);

    useEffect(() => {
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => { if (data.length) setProjectsData(data); })
            .catch(console.error);
    }, []);

    const categories = ['All', 'Machine Learning', 'Web'];
    
    const filteredProjects = activeFilter === 'All' 
        ? projectsData 
        : projectsData.filter(project => project.category === activeFilter);

    return (
        <section id="projects" className="projects-section">
            <div className="container">
                <h2 className="section-title reveal">Projects</h2>
                
                <div className="filters reveal">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                            onClick={() => setActiveFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                
                <div className="projects-grid">
                    {filteredProjects.map((project, index) => (
                        <div 
                            className={`project-card glass-card reveal ${project.is_featured ? 'featured' : ''}`} 
                            key={project.id}
                            style={{ transitionDelay: `${index * 0.1}s` }}
                        >
                            {project.status_badge === 'live' && <div className="status-badge live"><i className="fa-solid fa-circle-check"></i> Live</div>}
                            {project.status_badge === 'completed' && <div className="status-badge completed"><i className="fa-solid fa-check"></i> Completed</div>}
                            {project.status_badge === 'progress' && <div className="status-badge progress"><i className="fa-solid fa-person-digging"></i> In Progress</div>}
                            
                            <h3 className="project-title">{project.title}</h3>
                            <p className="project-desc">{project.description}</p>
                            
                            <div className="project-tech">
                                {project.tech_badges.split(',').map(tech => (
                                    <span className="tech-badge" key={tech}>{tech}</span>
                                ))}
                            </div>
                            
                            <div className="project-links">
                                <a href={project.github_url} target="_blank" rel="noreferrer" className="btn btn-outline">
                                    <i className="fa-brands fa-github"></i> GitHub
                                </a>
                                
                                {project.live_url && (
                                    <a href={project.live_url} target="_blank" rel="noreferrer" className="btn btn-primary">
                                        <i className="fa-solid fa-external-link-alt"></i> Live Demo
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
