import { useState, useEffect } from 'react';

const Skills = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    
    const [skillsData, setSkillsData] = useState([
        { id: 1, name: "Python", category: "Languages", percentage: 90 },
        { id: 2, name: "C++", category: "Languages", percentage: 85 },
        { id: 3, name: "Java", category: "Languages", percentage: 75 },
        { id: 4, name: "HTML5", category: "Web", percentage: 95 },
        { id: 5, name: "CSS3", category: "Web", percentage: 90 },
        { id: 6, name: "JavaScript", category: "Web", percentage: 80 },
        { id: 7, name: "NumPy", category: "Machine Learning", percentage: 85 },
        { id: 8, name: "Pandas", category: "Machine Learning", percentage: 80 },
        { id: 9, name: "Matplotlib", category: "Machine Learning", percentage: 75 },
        { id: 10, name: "Scikit-Learn", category: "Machine Learning", percentage: 70 },
        { id: 11, name: "Git & GitHub", category: "Tools", percentage: 85 },
        { id: 12, name: "VS Code", category: "Tools", percentage: 90 }
    ]);

    useEffect(() => {
        fetch('/api/skills')
            .then(res => res.json())
            .then(data => { if (data.length) setSkillsData(data); })
            .catch(console.error);
    }, []);

    const categories = ['All', 'Languages', 'Web', 'Machine Learning', 'Tools'];
    
    const filteredSkills = activeFilter === 'All' 
        ? skillsData 
        : skillsData.filter(skill => skill.category === activeFilter);

    return (
        <section id="skills" className="skills-section">
            <div className="container">
                <h2 className="section-title reveal">Skills</h2>
                
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
                
                <div className="skills-grid reveal-stagger">
                    {filteredSkills.map(skill => (
                        <div className="skill-item" key={skill.id}>
                            <div className="skill-info">
                                <span>{skill.name}</span>
                                <span>{skill.percentage}%</span>
                            </div>
                            <div className="progress-bar">
                                <div 
                                    className="progress" 
                                    style={{ '--skill-width': `${skill.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="icon-grid glass-card reveal-stagger">
                    <div className="icon-item" title="Python"><i className="devicon-python-plain"></i></div>
                    <div className="icon-item" title="C++"><i className="devicon-cplusplus-plain"></i></div>
                    <div className="icon-item" title="Java"><i className="devicon-java-plain"></i></div>
                    <div className="icon-item" title="HTML5"><i className="devicon-html5-plain"></i></div>
                    <div className="icon-item" title="CSS3"><i className="devicon-css3-plain"></i></div>
                    <div className="icon-item" title="JavaScript"><i className="devicon-javascript-plain"></i></div>
                    <div className="icon-item" title="NumPy"><i className="devicon-numpy-plain"></i></div>
                    <div className="icon-item" title="Pandas"><i className="devicon-pandas-plain"></i></div>
                    <div className="icon-item" title="Git"><i className="devicon-git-plain"></i></div>
                    <div className="icon-item" title="GitHub"><i className="devicon-github-original"></i></div>
                    <div className="icon-item" title="VS Code"><i className="devicon-vscode-plain"></i></div>
                </div>
                
                <div className="github-stats-card glass-card reveal">
                    <i className="fa-brands fa-github" style={{fontSize: '3rem', color: 'var(--text-secondary)'}}></i>
                    <p>View my live GitHub stats and commit history on my profile.</p>
                    <a href="https://github.com/wajeehaimran86-gif" target="_blank" rel="noreferrer" className="btn btn-outline mt-3">View GitHub Profile</a>
                </div>
            </div>
        </section>
    );
};

export default Skills;
