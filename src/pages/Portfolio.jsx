import Loader from '../components/Loader';
import Banner from '../components/Banner';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Education from '../components/Education';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Resume from '../components/Resume';
import Hobbies from '../components/Hobbies';
import LocationMap from '../components/Map';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import FloatingElements from '../components/FloatingElements';

const Portfolio = ({ theme, toggleTheme }) => {
    return (
        <>
            <Loader />
            <Banner />
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <Hero theme={theme} />
            <About />
            <Education />
            <Skills />
            <Projects />
            <Resume />
            <Hobbies />
            <LocationMap />
            <Contact />
            <Footer />
            <FloatingElements />
        </>
    );
};

export default Portfolio;
