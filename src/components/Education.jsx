import { useState, useEffect } from 'react';

const Education = () => {
    const [educationData, setEducationData] = useState([
        {
            id: 1,
            degree: "BS Computer Science",
            institution: "National University of Computer and Emerging Sciences (FAST-NUCES)",
            board_or_note: "",
            start_year: "Aug 2025",
            end_year: "Present",
            description: "Currently in my 3rd semester, focusing on core computer science fundamentals, data structures, and algorithms."
        },
        {
            id: 2,
            degree: "Pre-Engineering (FSc)",
            institution: "Punjab Group of Colleges, Gojra",
            board_or_note: "",
            start_year: "2023",
            end_year: "2025",
            description: "Completed intermediate education with a strong foundation in Mathematics and Physics."
        },
        {
            id: 3,
            degree: "Matriculation",
            institution: "Allied School Higher Secondary Campus, Gojra",
            board_or_note: "",
            start_year: "2021",
            end_year: "2023",
            description: "Completed secondary education with excellent academic standing."
        }
    ]);

    useEffect(() => {
        fetch('/api/education')
            .then(res => res.json())
            .then(data => { if (data.length) setEducationData(data); })
            .catch(console.error);
    }, []);

    return (
        <section id="education" className="education-section">
            <div className="container">
                <h2 className="section-title reveal">Education</h2>
                
                <div className="timeline">
                    {educationData.map((edu, index) => (
                        <div className="timeline-item reveal" key={edu.id} style={{ transitionDelay: `${index * 0.2}s` }}>
                            <div className="timeline-dot"></div>
                            <div className="timeline-content glass-card">
                                <h3>{edu.degree}</h3>
                                <h4>{edu.institution}</h4>
                                {edu.board_or_note && <p><strong>{edu.board_or_note}</strong></p>}
                                <span className="duration">{edu.start_year} &mdash; {edu.end_year}</span>
                                <p>{edu.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
