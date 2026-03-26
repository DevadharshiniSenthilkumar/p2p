/* ─── localStorage-based data store (demo / fallback mode) ─── */

const KEYS = {
    USERS: 'parkspot_users',
    LOTS: 'parkspot_lots',
    BOOKINGS: 'parkspot_bookings',
    PRICING: 'parkspot_pricing',
    SESSION: 'parkspot_session',
};

function get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
}
function set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

/* ─── Seed defaults ─── */
export function seedDefaults() {
    if (!get(KEYS.PRICING)) {
        set(KEYS.PRICING, { car: 70, bike: 40 });
    }
    if (!get(KEYS.USERS)) {
        set(KEYS.USERS, [
            { id: 'admin-1', name: 'Admin', email: 'admin@parkspot.com', password: 'admin123', phone: '0000000000', role: 'admin' },
        ]);
    }
    if (!get(KEYS.LOTS)) set(KEYS.LOTS, getSampleLots());
    if (!get(KEYS.BOOKINGS)) set(KEYS.BOOKINGS, []);
}

function getSampleLots() {
    return [
        {
            id: 'lot-1', ownerId: 'sample-owner', ownerName: 'Ravi Kumar',
            name: 'City Center Parking', address: '12 Anna Salai, Chennai',
            lat: 13.0827, lng: 80.2707,
            totalSlots: 20, slotTypes: [{ type: 'car', count: 14 }, { type: 'bike', count: 6 }],
            availableSlots: { car: 14, bike: 6 },
        },
        {
            id: 'lot-2', ownerId: 'sample-owner', ownerName: 'Priya S',
            name: 'Marina Beach Parking', address: '45 Kamarajar Salai, Chennai',
            lat: 13.0500, lng: 80.2824,
            totalSlots: 30, slotTypes: [{ type: 'car', count: 20 }, { type: 'bike', count: 10 }],
            availableSlots: { car: 20, bike: 10 },
        },
        {
            id: 'lot-3', ownerId: 'sample-owner', ownerName: 'Arun M',
            name: 'T Nagar Hub Parking', address: '78 Usman Road, T Nagar',
            lat: 13.0418, lng: 80.2341,
            totalSlots: 15, slotTypes: [{ type: 'car', count: 10 }, { type: 'bike', count: 5 }],
            availableSlots: { car: 10, bike: 5 },
        },
    ];
}

/* ─── Users ─── */
export function getUsers() { return get(KEYS.USERS) || []; }
export function addUser(user) { const u = getUsers(); u.push(user); set(KEYS.USERS, u); }
export function findUser(email, password) {
    return getUsers().find(u => u.email === email && u.password === password) || null;
}
export function findUserByEmail(email) {
    return getUsers().find(u => u.email === email) || null;
}

/* ─── Session ─── */
export function getSession() { return get(KEYS.SESSION); }
export function setSession(user) { set(KEYS.SESSION, user); }
export function clearSession() { localStorage.removeItem(KEYS.SESSION); }

/* ─── Parking Lots ─── */
export function getLots() { return get(KEYS.LOTS) || []; }
export function addLot(lot) { const l = getLots(); l.push(lot); set(KEYS.LOTS, l); }
export function updateLot(id, updates) {
    const lots = getLots().map(l => l.id === id ? { ...l, ...updates } : l);
    set(KEYS.LOTS, lots);
}
export function deleteLot(id) {
    set(KEYS.LOTS, getLots().filter(l => l.id !== id));
}
export function getLotsByOwner(ownerId) { return getLots().filter(l => l.ownerId === ownerId); }

/* ─── Bookings ─── */
export function getBookings() { return get(KEYS.BOOKINGS) || []; }
export function addBooking(booking) { const b = getBookings(); b.push(booking); set(KEYS.BOOKINGS, b); }
export function getBookingsByUser(userId) { return getBookings().filter(b => b.userId === userId); }
export function getBookingsByLot(lotId) { return getBookings().filter(b => b.lotId === lotId); }

/* ─── Pricing ─── */
export function getPricing() { return get(KEYS.PRICING) || { car: 70, bike: 40 }; }
export function setPricing(pricing) { set(KEYS.PRICING, pricing); }
