"""
ParkSpot — Flask API Backend
Provides REST endpoints for parking lots, bookings, and pricing.
Currently uses in-memory data store. Connect to Supabase for production.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os
import uuid

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])

# ─── In-memory data store (swap with Supabase in production) ───
data = {
    "pricing": {"car": 70, "bike": 40},
    "lots": [
        {
            "id": "lot-1", "ownerId": "sample-owner", "ownerName": "Ravi Kumar",
            "name": "City Center Parking", "address": "12 Anna Salai, Chennai",
            "lat": 13.0827, "lng": 80.2707,
            "totalSlots": 20,
            "slotTypes": [{"type": "car", "count": 14}, {"type": "bike", "count": 6}],
            "availableSlots": {"car": 14, "bike": 6},
        },
        {
            "id": "lot-2", "ownerId": "sample-owner", "ownerName": "Priya S",
            "name": "Marina Beach Parking", "address": "45 Kamarajar Salai, Chennai",
            "lat": 13.0500, "lng": 80.2824,
            "totalSlots": 30,
            "slotTypes": [{"type": "car", "count": 20}, {"type": "bike", "count": 10}],
            "availableSlots": {"car": 20, "bike": 10},
        },
        {
            "id": "lot-3", "ownerId": "sample-owner", "ownerName": "Arun M",
            "name": "T Nagar Hub Parking", "address": "78 Usman Road, T Nagar",
            "lat": 13.0418, "lng": 80.2341,
            "totalSlots": 15,
            "slotTypes": [{"type": "car", "count": 10}, {"type": "bike", "count": 5}],
            "availableSlots": {"car": 10, "bike": 5},
        },
    ],
    "bookings": [],
}


# ─── Pricing ───
@app.route("/api/pricing", methods=["GET"])
def get_pricing():
    return jsonify(data["pricing"])


@app.route("/api/pricing", methods=["PUT"])
def update_pricing():
    body = request.json
    data["pricing"].update(body)
    return jsonify(data["pricing"])


# ─── Lots ───
@app.route("/api/lots", methods=["GET"])
def get_lots():
    return jsonify(data["lots"])


@app.route("/api/lots", methods=["POST"])
def add_lot():
    body = request.json
    body["id"] = f"lot-{uuid.uuid4().hex[:8]}"
    data["lots"].append(body)
    return jsonify(body), 201


@app.route("/api/lots/<lot_id>", methods=["DELETE"])
def delete_lot(lot_id):
    data["lots"] = [l for l in data["lots"] if l["id"] != lot_id]
    return jsonify({"ok": True})


# ─── Bookings ───
@app.route("/api/bookings", methods=["GET"])
def get_bookings():
    return jsonify(data["bookings"])


@app.route("/api/bookings", methods=["POST"])
def add_booking():
    body = request.json
    body["id"] = f"booking-{uuid.uuid4().hex[:8]}"
    body["bookedAt"] = datetime.utcnow().isoformat()
    data["bookings"].append(body)

    # Update slot availability
    for lot in data["lots"]:
        if lot["id"] == body.get("lotId"):
            vtype = body.get("vehicleType", "car")
            lot["availableSlots"][vtype] = max(0, lot["availableSlots"].get(vtype, 0) - 1)
            break

    return jsonify(body), 201


# ─── Health ───
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "ParkSpot API"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, port=port)
