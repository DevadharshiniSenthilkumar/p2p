import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="brand">
                    <span className="brand-icon">🅿</span>
                    <span className="brand-text">Park<span className="accent">Spot</span></span>
                </Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/about" className="nav-link">About</Link>

                    {user && user.role === 'owner' && (
                        <Link to="/owner" className="nav-link">Dashboard</Link>
                    )}
                    {user && user.role === 'vehicle' && (
                        <Link to="/booking" className="nav-link">Book Parking</Link>
                    )}
                    {user && user.role === 'admin' && (
                        <Link to="/admin" className="nav-link">Admin Panel</Link>
                    )}

                    {!user ? (
                        <>
                            <Link to="/login" className="nav-link btn-outline">Login</Link>
                            <Link to="/register" className="nav-link btn-primary">Register</Link>
                        </>
                    ) : (
                        <button onClick={handleLogout} className="nav-link btn-outline">
                            Logout ({user.name})
                        </button>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button className="hamburger" onClick={(e) => {
                    e.currentTarget.parentElement.querySelector('.nav-links').classList.toggle('open');
                }}>
                    <span></span><span></span><span></span>
                </button>
            </div>
        </nav>
    );
}
