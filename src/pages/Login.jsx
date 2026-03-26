import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = login(email, password);
        setLoading(false);

        if (result.error) {
            setError(result.error);
            return;
        }

        toast('Welcome back! 🎉', 'success');

        // Role-based redirect
        const session = JSON.parse(localStorage.getItem('parkspot_session'));
        if (session?.role === 'owner') navigate('/owner');
        else if (session?.role === 'vehicle') navigate('/booking');
        else if (session?.role === 'admin') navigate('/admin');
        else navigate('/');
    }

    return (
        <div className="page auth-page">
            <div className="glass-card auth-card">
                <h2>Welcome <span className="accent">Back</span></h2>
                <p className="subtitle">Sign in to your ParkSpot account</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-red btn-block" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="auth-footer mt-2">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>

                <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(229,9,20,0.08)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Demo Accounts:</strong><br />
                    Admin: admin@parkspot.com / admin123
                </div>
            </div>
        </div>
    );
}
