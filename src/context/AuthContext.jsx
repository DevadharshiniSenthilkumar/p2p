import { createContext, useContext, useState, useEffect } from 'react';
import * as store from '../store';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        store.seedDefaults();
        const session = store.getSession();
        if (session) setUser(session);
        setLoading(false);
    }, []);

    function login(email, password) {
        const found = store.findUser(email, password);
        if (!found) return { error: 'Invalid email or password' };
        store.setSession(found);
        setUser(found);
        return { error: null };
    }

    function register(userData) {
        if (store.findUserByEmail(userData.email)) {
            return { error: 'Email already registered' };
        }
        const newUser = { id: 'user-' + Date.now(), ...userData };
        store.addUser(newUser);
        store.setSession(newUser);
        setUser(newUser);
        return { error: null };
    }

    function logout() {
        store.clearSession();
        setUser(null);
    }

    function generateOTP() {
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, generateOTP }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
