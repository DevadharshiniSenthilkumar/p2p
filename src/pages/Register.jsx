import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Register() {
    const { register, generateOTP } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [searchParams] = useSearchParams();

    const initialRole = searchParams.get('role') || 'vehicle';
    const [role, setRole] = useState(initialRole);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [generatedOTP, setGeneratedOTP] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [pendingData, setPendingData] = useState(null);

    const [form, setForm] = useState({
        name: '', email: '', phone: '', password: '',
        // Owner fields
        address: '', numSlots: '', slotType: 'car',
        // Vehicle owner fields
        vehicleNumber: '',
    });

    function updateForm(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (!form.name || !form.email || !form.phone || !form.password) {
            setError('Please fill all required fields');
            return;
        }

        // Generate OTP for phone verification
        const otp = generateOTP();
        setGeneratedOTP(otp);
        setPendingData({ ...form, role });
        setShowOTP(true);
        toast(`OTP sent to ${form.phone} (simulated)`, 'info');
    }

    function verifyOTP() {
        if (otpInput !== generatedOTP) {
            setError('Invalid OTP. Please try again.');
            return;
        }

        setLoading(true);
        const result = register(pendingData);
        setLoading(false);

        if (result.error) {
            setError(result.error);
            setShowOTP(false);
            return;
        }

        toast('Registration successful! 🎉', 'success');

        if (role === 'owner') navigate('/owner');
        else navigate('/booking');
    }

    return (
        <div className="page auth-page">
            <div className="glass-card auth-card">
                <h2>Create <span className="accent">Account</span></h2>
                <p className="subtitle">Join ParkSpot today</p>

                {/* Role Tabs */}
                <div className="role-tabs">
                    <button
                        className={`role-tab ${role === 'vehicle' ? 'active' : ''}`}
                        onClick={() => setRole('vehicle')}
                    >
                        🚗 Vehicle Owner
                    </button>
                    <button
                        className={`role-tab ${role === 'owner' ? 'active' : ''}`}
                        onClick={() => setRole('owner')}
                    >
                        🅿 Parking Owner
                    </button>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="grid-2">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input type="text" className="form-control" placeholder="Your name"
                                value={form.name} onChange={e => updateForm('name', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Mobile Number *</label>
                            <input type="tel" className="form-control" placeholder="+91 XXXXXXXXXX"
                                value={form.phone} onChange={e => updateForm('phone', e.target.value)} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email *</label>
                        <input type="email" className="form-control" placeholder="you@example.com"
                            value={form.email} onChange={e => updateForm('email', e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password *</label>
                        <input type="password" className="form-control" placeholder="Min 6 characters"
                            value={form.password} onChange={e => updateForm('password', e.target.value)} required minLength={6} />
                    </div>

                    {/* Owner-specific fields */}
                    {role === 'owner' && (
                        <>
                            <div className="form-group">
                                <label>Parking Address *</label>
                                <input type="text" className="form-control" placeholder="Full address of your parking lot"
                                    value={form.address} onChange={e => updateForm('address', e.target.value)} required />
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Number of Slots</label>
                                    <input type="number" className="form-control" placeholder="e.g., 10"
                                        value={form.numSlots} onChange={e => updateForm('numSlots', e.target.value)} min={1} />
                                </div>
                                <div className="form-group">
                                    <label>Slot Type</label>
                                    <select className="form-control" value={form.slotType}
                                        onChange={e => updateForm('slotType', e.target.value)}>
                                        <option value="car">Car</option>
                                        <option value="bike">Bike</option>
                                        <option value="both">Both (Car & Bike)</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Vehicle owner fields */}
                    {role === 'vehicle' && (
                        <div className="form-group">
                            <label>Vehicle Number *</label>
                            <input type="text" className="form-control" placeholder="e.g., TN 01 AB 1234"
                                value={form.vehicleNumber} onChange={e => updateForm('vehicleNumber', e.target.value)} required />
                        </div>
                    )}

                    <button type="submit" className="btn btn-red btn-block mt-2" disabled={loading}>
                        Send OTP & Register
                    </button>
                </form>

                <p className="auth-footer mt-2">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>

            {/* OTP Modal */}
            {showOTP && (
                <div className="otp-overlay" onClick={() => setShowOTP(false)}>
                    <div className="glass-card otp-card" onClick={e => e.stopPropagation()}>
                        <h2>Verify <span className="accent">OTP</span></h2>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                            We sent a verification code to <strong>{form.phone}</strong>
                        </p>
                        <div className="otp-code">{generatedOTP}</div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                            (Simulated — in production, this would be sent via SMS)
                        </p>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter 6-digit OTP"
                                value={otpInput}
                                onChange={e => setOtpInput(e.target.value)}
                                maxLength={6}
                                style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '8px' }}
                            />
                        </div>
                        {error && <div className="error-msg">{error}</div>}
                        <button onClick={verifyOTP} className="btn btn-red btn-block" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify & Register'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
