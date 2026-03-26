import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import * as store from '../store';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function LocationPicker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });
    return position ? <Marker position={position} /> : null;
}

export default function OwnerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [lots, setLots] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [mapPos, setMapPos] = useState(null);
    const pricing = store.getPricing();

    const [form, setForm] = useState({
        name: '', address: '', carSlots: '5', bikeSlots: '5',
    });

    useEffect(() => {
        if (!user || user.role !== 'owner') { navigate('/login'); return; }
        setLots(store.getLotsByOwner(user.id));
        // Get bookings for owner's lots
        const ownerLotIds = store.getLotsByOwner(user.id).map(l => l.id);
        setBookings(store.getBookings().filter(b => ownerLotIds.includes(b.lotId)));
    }, [user, navigate]);

    function updateForm(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    function handleAddLot(e) {
        e.preventDefault();
        if (!mapPos) { toast('Please click on the map to set location', 'error'); return; }

        const newLot = {
            id: 'lot-' + Date.now(),
            ownerId: user.id,
            ownerName: user.name,
            name: form.name,
            address: form.address,
            lat: mapPos[0],
            lng: mapPos[1],
            totalSlots: parseInt(form.carSlots) + parseInt(form.bikeSlots),
            slotTypes: [
                { type: 'car', count: parseInt(form.carSlots) },
                { type: 'bike', count: parseInt(form.bikeSlots) },
            ],
            availableSlots: { car: parseInt(form.carSlots), bike: parseInt(form.bikeSlots) },
        };

        store.addLot(newLot);
        setLots(store.getLotsByOwner(user.id));
        setShowForm(false);
        setForm({ name: '', address: '', carSlots: '5', bikeSlots: '5' });
        setMapPos(null);
        toast('Parking lot added successfully!', 'success');
    }

    const totalSlots = lots.reduce((sum, l) => sum + l.totalSlots, 0);
    const totalBookings = bookings.length;
    const revenue = bookings.reduce((sum, b) => sum + (b.totalCost || 0), 0);

    return (
        <div className="page">
            <div className="container dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1>Owner <span className="accent">Dashboard</span></h1>
                        <p className="text-muted">Manage your parking lots</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} className="btn btn-red">
                        {showForm ? '✕ Cancel' : '+ Add New Lot'}
                    </button>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="glass-card stat-card">
                        <div className="stat-value">{lots.length}</div>
                        <div className="stat-label">Parking Lots</div>
                    </div>
                    <div className="glass-card stat-card">
                        <div className="stat-value">{totalSlots}</div>
                        <div className="stat-label">Total Slots</div>
                    </div>
                    <div className="glass-card stat-card">
                        <div className="stat-value">{totalBookings}</div>
                        <div className="stat-label">Bookings</div>
                    </div>
                    <div className="glass-card stat-card">
                        <div className="stat-value">₹{revenue}</div>
                        <div className="stat-label">Revenue</div>
                    </div>
                </div>

                {/* Add Lot Form */}
                {showForm && (
                    <div className="glass-card-static mb-3">
                        <h3 style={{ marginBottom: '20px' }}>Add <span className="accent">New Lot</span></h3>
                        <form onSubmit={handleAddLot}>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Lot Name</label>
                                    <input type="text" className="form-control" placeholder="e.g., Downtown Parking"
                                        value={form.name} onChange={e => updateForm('name', e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input type="text" className="form-control" placeholder="Full address"
                                        value={form.address} onChange={e => updateForm('address', e.target.value)} required />
                                </div>
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Car Slots</label>
                                    <input type="number" className="form-control" min={0}
                                        value={form.carSlots} onChange={e => updateForm('carSlots', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Bike Slots</label>
                                    <input type="number" className="form-control" min={0}
                                        value={form.bikeSlots} onChange={e => updateForm('bikeSlots', e.target.value)} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>📍 Click on map to set location</label>
                                <div className="map-container map-container-sm">
                                    <MapContainer center={[13.0827, 80.2707]} zoom={12} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer
                                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                            attribution='&copy; CartoDB'
                                        />
                                        <LocationPicker position={mapPos} setPosition={setMapPos} />
                                    </MapContainer>
                                </div>
                                {mapPos && <p className="mt-1 text-muted" style={{ fontSize: '0.8rem' }}>
                                    📍 {mapPos[0].toFixed(4)}, {mapPos[1].toFixed(4)}
                                </p>}
                            </div>

                            <button type="submit" className="btn btn-red">Add Parking Lot</button>
                        </form>
                    </div>
                )}

                {/* Lots List */}
                <h3 className="mb-2">Your <span className="accent">Lots</span></h3>
                {lots.length === 0 ? (
                    <div className="glass-card empty-state">
                        <div className="icon">🅿</div>
                        <h3>No parking lots yet</h3>
                        <p>Click "Add New Lot" to get started</p>
                    </div>
                ) : (
                    <div className="lots-grid">
                        {lots.map(lot => (
                            <div key={lot.id} className="glass-card lot-card">
                                <h3>{lot.name}</h3>
                                <p className="address">📍 {lot.address}</p>
                                <div className="lot-tags">
                                    {lot.slotTypes.map(st => (
                                        <span key={st.type} className="lot-tag">
                                            {st.type === 'car' ? '🚗' : '🏍'} {st.count} {st.type} slots
                                        </span>
                                    ))}
                                    <span className="lot-tag green">
                                        ₹{pricing[lot.slotTypes[0]?.type] || pricing.car}/hr
                                    </span>
                                </div>
                                <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                                    Available: {lot.availableSlots.car} car, {lot.availableSlots.bike} bike
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recent Bookings */}
                {bookings.length > 0 && (
                    <>
                        <h3 className="mb-2 mt-3">Recent <span className="accent">Bookings</span></h3>
                        <div className="glass-card-static" style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Vehicle</th>
                                        <th>Lot</th>
                                        <th>Type</th>
                                        <th>Duration</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.slice(0, 10).map(b => (
                                        <tr key={b.id}>
                                            <td>{b.vehicleNumber || 'N/A'}</td>
                                            <td>{b.lotName}</td>
                                            <td>{b.vehicleType}</td>
                                            <td>{b.hours}h</td>
                                            <td className="text-red">₹{b.totalCost}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
