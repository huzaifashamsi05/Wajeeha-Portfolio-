import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found-page">
            <div className="container text-center">
                <h1 className="animated-404">404</h1>
                <h2>Oops! This page doesn't exist.</h2>
                <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <Link to="/" className="btn btn-primary mt-4">
                    <i className="fa-solid fa-house"></i> Go Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
