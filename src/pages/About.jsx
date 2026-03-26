export default function About() {
    return (
        <div className="page">
            {/* ── Hero ── */}
            <section className="about-hero">
                <h1>About <span className="accent">ParkSpot</span></h1>
                <p>Bridging the gap between parking supply and demand — making cities smarter, one spot at a time.</p>
            </section>

            <div className="container">
                {/* ── Mission ── */}
                <section className="about-section">
                    <div className="glass-card-static">
                        <h2>Our <span className="accent">Mission</span></h2>
                        <p>
                            ParkSpot was born from a simple yet powerful idea: <strong>"Bringing the gap in urban parking."</strong>
                            In a world where cities are growing faster than their infrastructure,
                            finding a parking spot shouldn't feel like searching for a needle in a haystack.
                        </p>
                        <p>
                            We connect parking plot owners with vehicle owners through an intelligent,
                            real-time matching system — turning unused spaces into revenue and wasted time into productive moments.
                        </p>
                    </div>
                </section>

                {/* ── SDG 11 ── */}
                <section className="about-section">
                    <div className="glass-card-static">
                        <h2>Our <span className="accent">Impact</span></h2>
                        <div className="sdg-badge">
                            <div className="number">11</div>
                            <div>
                                <strong>SDG 11 — Sustainable Cities and Communities</strong>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    United Nations Sustainable Development Goal
                                </p>
                            </div>
                        </div>
                        <p>
                            ParkSpot directly contributes to <strong>SDG 11</strong> by reducing urban congestion,
                            improving parking efficiency, and supporting safer, more organized urban mobility.
                            Every booked slot means one less car circling the block, less CO₂ emissions,
                            and a step toward more sustainable cities.
                        </p>
                        <div className="rules-grid mt-3">
                            <div className="rule-item">
                                <div className="rule-icon">🚗</div>
                                <span>Reduces traffic congestion from parking searches</span>
                            </div>
                            <div className="rule-item">
                                <div className="rule-icon">🌱</div>
                                <span>Lowers carbon emissions with optimized routes</span>
                            </div>
                            <div className="rule-item">
                                <div className="rule-icon">🏙️</div>
                                <span>Promotes organized urban mobility systems</span>
                            </div>
                            <div className="rule-item">
                                <div className="rule-icon">🛡️</div>
                                <span>Enhances safety with verified parking zones</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Team ── */}
                <section className="about-section">
                    <h2 className="section-title">Meet Our <span className="accent">Team</span></h2>
                    <p className="section-subtitle">The people behind ParkSpot</p>
                    <div className="team-grid">
                        <div className="glass-card team-card">
                            <div className="team-avatar">DS</div>
                            <h3>Devadharshini Senthilkumar</h3>
                            <p className="role">Founder</p>
                            <p className="email">devathefounder@gmail.com</p>
                        </div>
                        <div className="glass-card team-card">
                            <div className="team-avatar">AV</div>
                            <h3>Aishwaryaa Vimalkumar</h3>
                            <p className="role">CEO</p>
                            <p className="email">aishutheceo@gmail.com</p>
                        </div>
                    </div>
                </section>

                {/* ── Location ── */}
                <section className="about-section">
                    <div className="glass-card-static" style={{ textAlign: 'center' }}>
                        <h2>Our <span className="accent">Location</span></h2>
                        <p style={{ fontSize: '1.1rem', marginTop: '12px' }}>
                            📍 No.6, Vivekanandha Theru<br />
                            Dubai Kurukku Sandu, Dubai Main Roadu<br />
                            Dubai
                        </p>
                    </div>
                </section>
            </div>

            <footer className="footer mt-3">
                <p>© 2026 Park<span className="accent">Spot</span>. Building sustainable cities together.</p>
            </footer>
        </div>
    );
}
