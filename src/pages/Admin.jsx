import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import * as store from '../store';

export default function Admin() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [pricing, setPricingState] = useState(store.getPricing());
    const [lots, setLots] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!user || user.role !== 'admin') { navigate('/login'); return; }
        setLots(store.getLots());
        setBookings(store.getBookings());
    }, [user, navigate]);

    function updatePricing(type, value) {
        const newPricing = { ...pricing, [type]: parseInt(value) || 0 };
        setPricingState(newPricing);
        store.setPricing(newPricing);
        toast(`${type} rate updated to ₹${value}/hr`, 'success');
    }

    function handleDeleteLot(id) {
        store.deleteLot(id);
        setLots(store.getLots());
        toast('Lot deleted', 'success');
    }

    const totalRevenue = bookings.reduce((s, b) => s + (b.totalCost || 0), 0);
    const totalSlots = lots.reduce((s, l) => s + l.totalSlots, 0);
    const uniqueUsers = new Set(bookings.map(b => b.userId)).size;

    return (
        <div className="page">
            <div className="container dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1>Admin <span className="accent">Panel</span></h1>
                        <p className="text-muted">Manage pricing, lots, and bookings</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="glass-card stat-card">
                        <div className="stat-value">{lots.length}</div>
                        <div className="stat-label">Total Lots</div>
                    </div>
                    <div className="glass-card stat-card">
                        <div className="stat-value">{totalSlots}</div>
                        <div className="stat-label">Total Slots</div>
                    </div>
                    <div className="glass-card stat-card">
                        <div className="stat-value">{bookings.length}</div>
                        <div className="stat-label">Bookings</div>
                    </div>
                    <div className="glass-card stat-card">
                        <div className="stat-value">₹{totalRevenue}</div>
                        <div className="stat-label">Revenue</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="role-tabs mb-3" style={{ maxWidth: '500px' }}>
                    {['overview', 'pricing', 'lots', 'bookings'].map(tab => (
                        <button key={tab} className={`role-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Overview */}
                {activeTab === 'overview' && (
                    <div className="admin-grid">
                        <div className="glass-card-static admin-section">
                            <h3>📊 Quick Stats</h3>
                            <div className="confirmation-details">
                                <div className="detail-row">
                                    <span className="label">Unique Users</span>
                                    <span className="value">{uniqueUsers}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Avg Booking Value</span>
                                    <span className="value">₹{bookings.length ? Math.round(totalRevenue / bookings.length) : 0}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Car Rate</span>
                                    <span className="value text-red">₹{pricing.car}/hr</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Bike Rate</span>
                                    <span className="value text-red">₹{pricing.bike}/hr</span>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card-static admin-section">
                            <h3>📈 Recent Activity</h3>
                            {bookings.length === 0 ? (
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>No bookings yet</p>
                            ) : (
                                bookings.slice(-5).reverse().map(b => (
                                    <div key={b.id} style={{
                                        padding: '10px', marginBottom: '8px',
                                        background: 'rgba(20,20,20,0.5)', borderRadius: '8px', fontSize: '0.85rem'
                                    }}>
                                        <strong>{b.userName || 'User'}</strong> booked {b.vehicleType} at <span className="accent">{b.lotName}</span>
                                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                                            {b.hours}h • ₹{b.totalCost}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Pricing */}
                {activeTab === 'pricing' && (
                    <div className="glass-card-static" style={{ maxWidth: '600px' }}>
                        <h3 style={{ marginBottom: '24px' }}>💰 Manage <span className="accent">Pricing</span></h3>
                        <div className="pricing-row">
                            <label>🚗 Car</label>
                            <input type="number" className="form-control" value={pricing.car}
                                onChange={e => updatePricing('car', e.target.value)} min={1} />
                            <span className="text-muted">/hr</span>
                        </div>
                        <div className="pricing-row">
                            <label>🏍 Bike</label>
                            <input type="number" className="form-control" value={pricing.bike}
                                onChange={e => updatePricing('bike', e.target.value)} min={1} />
                            <span className="text-muted">/hr</span>
                        </div>
                        <p className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
                            Changes are saved automatically and apply to all new bookings.
                        </p>
                    </div>
                )}

                {/* Lots */}
                {activeTab === 'lots' && (
                    <div className="glass-card-static" style={{ overflowX: 'auto' }}>
                        <h3 style={{ marginBottom: '16px' }}>🅿 All <span className="accent">Parking Lots</span></h3>
                        {lots.length === 0 ? (
                            <p className="text-muted">No lots registered yet</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Owner</th>
                                        <th>Address</th>
                                        <th>Car Slots</th>
                                        <th>Bike Slots</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lots.map(l => (
                                        <tr key={l.id}>
                                            <td><strong>{l.name}</strong></td>
                                            <td>{l.ownerName || 'N/A'}</td>
                                            <td style={{ maxWidth: '200px', fontSize: '0.8rem' }}>{l.address}</td>
                                            <td>{l.availableSlots.car}/{l.slotTypes.find(s => s.type === 'car')?.count || 0}</td>
                                            <td>{l.availableSlots.bike}/{l.slotTypes.find(s => s.type === 'bike')?.count || 0}</td>
                                            <td>
                                                <button onClick={() => handleDeleteLot(l.id)}
                                                    className="btn btn-ghost btn-sm" style={{ color: 'var(--red-primary)' }}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Bookings */}
                {activeTab === 'bookings' && (
                    <div className="glass-card-static" style={{ overflowX: 'auto' }}>
                        <h3 style={{ marginBottom: '16px' }}>📋 All <span className="accent">Bookings</span></h3>
                        {bookings.length === 0 ? (
                            <p className="text-muted">No bookings yet</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Vehicle</th>
                                        <th>Lot</th>
                                        <th>Type</th>
                                        <th>Hours</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b.id}>
                                            <td>{b.userName || 'N/A'}</td>
                                            <td>{b.vehicleNumber || 'N/A'}</td>
                                            <td>{b.lotName}</td>
                                            <td>{b.vehicleType}</td>
                                            <td>{b.hours}h</td>
                                            <td className="text-red">₹{b.totalCost}</td>
                                            <td style={{ fontSize: '0.8rem' }}>{new Date(b.bookedAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
