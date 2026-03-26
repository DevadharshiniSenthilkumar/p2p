import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Particles from './components/Particles';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import VehicleBooking from './pages/VehicleBooking';
import Admin from './pages/Admin';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastProvider>
                    <div className="app-wrapper">
                        <Particles />
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/owner" element={<OwnerDashboard />} />
                            <Route path="/booking" element={<VehicleBooking />} />
                            <Route path="/admin" element={<Admin />} />
                        </Routes>
                    </div>
                </ToastProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
