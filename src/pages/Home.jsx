import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="page">
            {/* ── Hero ── */}
            <section className="hero">
                <span className="hero-badge">🚗 Smart Urban Parking</span>
                <h1>
                    Find & Book<br />
                    <span className="accent">Parking Instantly</span>
                </h1>
                <p>
                    Bridging the gap between parking supply and demand.
                    Discover nearby spots, reserve in seconds, and park stress-free.
                </p>
                <div className="hero-buttons">
                    {!user ? (
                        <>
                            <Link to="/register?role=owner" className="btn btn-red btn-lg">
                                🅿 List Your Parking
                            </Link>
                            <Link to="/register?role=vehicle" className="btn btn-ghost btn-lg">
                                🔍 Find Parking
                            </Link>
                        </>
                    ) : user.role === 'owner' ? (
                        <Link to="/owner" className="btn btn-red btn-lg">Go to Dashboard →</Link>
                    ) : user.role === 'vehicle' ? (
                        <Link to="/booking" className="btn btn-red btn-lg">Find Parking Now →</Link>
                    ) : (
                        <Link to="/admin" className="btn btn-red btn-lg">Admin Panel →</Link>
                    )}
                </div>
            </section>

            {/* ── Features ── */}
            <section className="features">
                <div className="container">
                    <h2 className="section-title">Why <span className="accent">ParkSpot</span>?</h2>
                    <p className="section-subtitle">Smart parking made simple for everyone</p>
                    <div className="features-grid">
                        <div className="glass-card feature-card">
                            <div className="feature-icon">📍</div>
                            <h3>Live Map Discovery</h3>
                            <p>Find available parking spots near you on an interactive map with real-time availability.</p>
                        </div>
                        <div className="glass-card feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3>Instant Booking</h3>
                            <p>Reserve your spot in seconds. No more circling blocks looking for parking.</p>
                        </div>
                        <div className="glass-card feature-card">
                            <div className="feature-icon">💰</div>
                            <h3>Transparent Pricing</h3>
                            <p>Clear hourly rates for cars (₹70/hr) and bikes (₹40/hr). No hidden fees.</p>
                        </div>
                        <div className="glass-card feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3>Secure & Verified</h3>
                            <p>OTP-verified users and verified parking locations for your safety.</p>
                        </div>
                        <div className="glass-card feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>Owner Dashboard</h3>
                            <p>Parking plot owners can manage lots, track bookings, and grow revenue effortlessly.</p>
                        </div>
                        <div className="glass-card feature-card">
                            <div className="feature-icon">🌍</div>
                            <h3>SDG 11 Aligned</h3>
                            <p>Contributing to Sustainable Cities & Communities by reducing congestion and emissions.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Parking Rules ── */}
            <section className="rules">
                <div className="container">
                    <h2 className="section-title">Parking <span className="accent">Rules</span></h2>
                    <p className="section-subtitle">Simple guidelines for a smooth experience</p>
                    <div className="rules-grid">
                        <div className="rule-item">
                            <div className="rule-icon">⏱</div>
                            <span>Minimum booking duration: 1 hour</span>
                        </div>
                        <div className="rule-item">
                            <div className="rule-icon">🌙</div>
                            <span>No parking after 10 PM in select zones</span>
                        </div>
                        <div className="rule-item">
                            <div className="rule-icon">🚫</div>
                            <span>No double parking allowed</span>
                        </div>
                        <div className="rule-item">
                            <div className="rule-icon">🎫</div>
                            <span>Keep your booking confirmation handy</span>
                        </div>
                        <div className="rule-item">
                            <div className="rule-icon">🚗</div>
                            <span>Park only in your assigned slot</span>
                        </div>
                        <div className="rule-item">
                            <div className="rule-icon">📞</div>
                            <span>Contact support for cancellations</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="footer">
                <p>© 2026 Park<span className="accent">Spot</span>. Bridging the gap in urban parking.</p>
            </footer>
        </div>
    );
}
