import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import * as store from '../store';

// Fix Leaflet default marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom red marker for available lots
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

export default function VehicleBooking() {
    const { user, generateOTP } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [lots, setLots] = useState([]);
    const [selectedLot, setSelectedLot] = useState(null);
    const [vehicleType, setVehicleType] = useState('car');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [confirmation, setConfirmation] = useState(null);
    const [bookingOTP, setBookingOTP] = useState('');
    const [myBookings, setMyBookings] = useState([]);
    const pricing = store.getPricing();

    useEffect(() => {
        if (!user || user.role !== 'vehicle') { navigate('/login'); return; }
        setLots(store.getLots());
        setMyBookings(store.getBookingsByUser(user.id));
    }, [user, navigate]);

    // Calculate hours and cost
    function calcDuration() {
        if (!startTime || !endTime) return { hours: 0, cost: 0 };
        const start = new Date(startTime);
        const end = new Date(endTime);
        const hours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
        const rate = pricing[vehicleType] || pricing.car;
        return { hours, cost: hours * rate };
    }

    // Calculate distance from user (simulated)
    function getDistance(lot) {
        // Simulated distance based on random factor
        return (Math.random() * 5 + 0.5).toFixed(1);
    }

    function handleBook() {
        if (!selectedLot) { toast('Please select a parking lot', 'error'); return; }
        if (!startTime || !endTime) { toast('Please select start and end time', 'error'); return; }

        const { hours, cost } = calcDuration();
        if (hours < 1) { toast('Minimum booking is 1 hour', 'error'); return; }

        if (selectedLot.availableSlots[vehicleType] <= 0) {
            toast(`No ${vehicleType} slots available at this lot`, 'error');
            return;
        }

        // Generate booking OTP
        const otp = generateOTP();
        setBookingOTP(otp);

        // Create booking
        const booking = {
            id: 'booking-' + Date.now(),
            userId: user.id,
            userName: user.name,
            vehicleNumber: user.vehicleNumber || 'N/A',
            lotId: selectedLot.id,
            lotName: selectedLot.name,
            lotAddress: selectedLot.address,
            lat: selectedLot.lat,
            lng: selectedLot.lng,
            vehicleType,
            startTime,
            endTime,
            hours,
            rate: pricing[vehicleType],
            totalCost: cost,
            otp,
            bookedAt: new Date().toISOString(),
        };

        store.addBooking(booking);

        // Update slot availability
        const updatedAvailable = { ...selectedLot.availableSlots };
        updatedAvailable[vehicleType] = Math.max(0, updatedAvailable[vehicleType] - 1);
        store.updateLot(selectedLot.id, { availableSlots: updatedAvailable });

        setConfirmation(booking);
        setMyBookings(store.getBookingsByUser(user.id));
        toast('Booking confirmed! 🎉', 'success');
    }

    const { hours, cost } = calcDuration();

    return (
        <div className="page">
            <div className="container">
                <h1 style={{ marginBottom: '8px' }}>Find <span className="accent">Parking</span></h1>
                <p className="text-muted mb-3">Discover and book nearby parking spots</p>

                <div className="booking-layout">
                    {/* Map */}
                    <div>
                        <div className="map-container" style={{ height: '500px' }}>
                            <MapContainer center={[13.0627, 80.2607]} zoom={12} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; CartoDB'
                                />
                                {lots.map(lot => (
                                    <Marker
                                        key={lot.id}
                                        position={[lot.lat, lot.lng]}
                                        icon={redIcon}
                                        eventHandlers={{
                                            click: () => setSelectedLot(lot),
                                        }}
                                    >
                                        <Popup>
                                            <div style={{ color: '#000', minWidth: '180px' }}>
                                                <strong>{lot.name}</strong><br />
                                                <span style={{ fontSize: '0.8rem' }}>{lot.address}</span><br />
                                                <span style={{ fontSize: '0.8rem' }}>
                                                    🚗 {lot.availableSlots.car} car • 🏍 {lot.availableSlots.bike} bike
                                                </span><br />
                                                <span style={{ fontSize: '0.8rem', color: '#e50914', fontWeight: 700 }}>
                                                    ₹{pricing.car}/hr car • ₹{pricing.bike}/hr bike
                                                </span>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>

                        {/* Lot list */}
                        <h3 className="mt-3 mb-2">Available <span className="accent">Lots</span></h3>
                        <div className="slot-list">
                            {lots.map(lot => (
                                <div
                                    key={lot.id}
                                    className={`slot-item ${selectedLot?.id === lot.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedLot(lot)}
                                >
                                    <div>
                                        <h4>{lot.name}</h4>
                                        <p className="slot-meta">
                                            📍 {lot.address} • ~{getDistance(lot)} km away
                                        </p>
                                        <p className="slot-meta">
                                            🚗 {lot.availableSlots.car} car • 🏍 {lot.availableSlots.bike} bike available
                                        </p>
                                    </div>
                                    <div className="slot-price">
                                        ₹{pricing[vehicleType]}/hr
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="booking-sidebar">
                        {!confirmation ? (
                            <div className="glass-card-static">
                                <h3 style={{ marginBottom: '20px' }}>Book a <span className="accent">Spot</span></h3>

                                {selectedLot && (
                                    <div style={{ padding: '12px', background: 'rgba(229,9,20,0.08)', borderRadius: '8px', marginBottom: '16px' }}>
                                        <strong>{selectedLot.name}</strong>
                                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>{selectedLot.address}</p>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Vehicle Type</label>
                                    <select className="form-control" value={vehicleType}
                                        onChange={e => setVehicleType(e.target.value)}>
                                        <option value="car">🚗 Car (₹{pricing.car}/hr)</option>
                                        <option value="bike">🏍 Bike (₹{pricing.bike}/hr)</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Start Time</label>
                                    <input type="datetime-local" className="form-control"
                                        value={startTime} onChange={e => setStartTime(e.target.value)} />
                                </div>

                                <div className="form-group">
                                    <label>End Time</label>
                                    <input type="datetime-local" className="form-control"
                                        value={endTime} onChange={e => setEndTime(e.target.value)} />
                                </div>

                                {startTime && endTime && hours > 0 && (
                                    <div className="confirmation-details mb-2">
                                        <div className="detail-row">
                                            <span className="label">Duration</span>
                                            <span className="value">{hours} hour{hours > 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Rate</span>
                                            <span className="value">₹{pricing[vehicleType]}/hr</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Total</span>
                                            <span className="value total">₹{cost}</span>
                                        </div>
                                    </div>
                                )}

                                <button onClick={handleBook} className="btn btn-red btn-block"
                                    disabled={!selectedLot || !startTime || !endTime}>
                                    Confirm Booking
                                </button>
                            </div>
                        ) : (
                            <div className="glass-card-static confirmation">
                                <div className="checkmark">✓</div>
                                <h2>Booking <span className="accent">Confirmed!</span></h2>
                                <p className="text-muted">Your spot is reserved</p>

                                <div style={{ margin: '16px 0', padding: '12px', background: 'rgba(229,9,20,0.1)', borderRadius: '8px' }}>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Your Booking OTP</p>
                                    <p className="otp-code" style={{ fontSize: '1.8rem', margin: '8px 0' }}>{bookingOTP}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Show this at the parking lot)</p>
                                </div>

                                <div className="confirmation-details">
                                    <div className="detail-row">
                                        <span className="label">Location</span>
                                        <span className="value">{confirmation.lotName}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Address</span>
                                        <span className="value" style={{ fontSize: '0.8rem' }}>{confirmation.lotAddress}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Vehicle</span>
                                        <span className="value">{confirmation.vehicleType} • {confirmation.vehicleNumber}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Start</span>
                                        <span className="value">{new Date(confirmation.startTime).toLocaleString()}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">End</span>
                                        <span className="value">{new Date(confirmation.endTime).toLocaleString()}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Duration</span>
                                        <span className="value">{confirmation.hours}h</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Total</span>
                                        <span className="value total">₹{confirmation.totalCost}</span>
                                    </div>
                                </div>

                                <a
                                    href={`https://www.google.com/maps?q=${confirmation.lat},${confirmation.lng}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="btn btn-ghost btn-block mt-2"
                                >
                                    📍 Open in Google Maps
                                </a>

                                <button onClick={() => setConfirmation(null)}
                                    className="btn btn-red btn-block mt-1">
                                    Book Another
                                </button>
                            </div>
                        )}

                        {/* My Bookings */}
                        {myBookings.length > 0 && (
                            <div className="glass-card-static">
                                <h3 style={{ marginBottom: '12px' }}>My <span className="accent">Bookings</span></h3>
                                {myBookings.slice(0, 5).map(b => (
                                    <div key={b.id} style={{
                                        padding: '10px', marginBottom: '8px',
                                        background: 'rgba(20,20,20,0.5)', borderRadius: '8px',
                                        fontSize: '0.85rem'
                                    }}>
                                        <strong>{b.lotName}</strong>
                                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                                            {b.vehicleType} • {b.hours}h • <span className="text-red">₹{b.totalCost}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
