"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaCalendarAlt, FaCar } from 'react-icons/fa';

export default function DriverSelectDestination() {
    const router = useRouter();
    const [pickup, setPickup] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [address, setAddress] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [seats, setSeats] = useState<number>(1);

    const saveRoute = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!pickup || !destination || !date) {
            alert('Please fill pickup, destination and date');
            return;
        }
        const routeKey = `${pickup}|${destination}|${date}`;
        try {
            const cur = typeof window !== 'undefined' ? localStorage.getItem('current_user_email') || 'guest' : 'guest';
            localStorage.setItem(`last_route_${cur}`, routeKey);
            // Also store a short last_route for convenience
            localStorage.setItem('last_route', routeKey);
            // fetch browser geolocation
            const getLoc = (opts?: PositionOptions) => new Promise<GeolocationPosition>((resolve, reject) => {
                if (!navigator || !navigator.geolocation) return reject(new Error('No geolocation'));
                navigator.geolocation.getCurrentPosition(resolve, reject, opts || { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 });
            });
            let latNum = 0, lngNum = 0;
            try {
                const pos = await getLoc();
                latNum = pos.coords.latitude;
                lngNum = pos.coords.longitude;
            } catch (e) {
                // fallback to 0,0
                latNum = 0; lngNum = 0;
            }
            // Save an active ride entry for this driver
            const activeKey = 'active_rides_v1';
            const raw = localStorage.getItem(activeKey);
            const list = raw ? JSON.parse(raw) : [];
            const ride = { id: `drv_${Date.now()}`, driver: cur, pickup, destination, date, time, address, location: { lat: latNum, lng: lngNum }, vehicleType, seats };
            list.push(ride);
            localStorage.setItem(activeKey, JSON.stringify(list));
            // update stored user location for proximity calculations
            const usersRaw = localStorage.getItem('local_users_v1');
            const users = usersRaw ? JSON.parse(usersRaw) : [];
            const idx = users.findIndex((u: any) => (u.email || u.phone) === cur);
            if (idx !== -1) {
                users[idx].location = { lat: latNum, lng: lngNum };
                localStorage.setItem('local_users_v1', JSON.stringify(users));
            }
        } catch (err) {}
        alert('Route saved for driver. You will now see requests matching this route.');
        router.push('/driver/rides');
    };

    return (
        <div className="min-h-screen text-black flex flex-col items-center pt-10 pb-20 px-4 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            <h1 className="text-4xl font-extrabold mb-8 text-white drop-shadow-lg">Driver: Select Destination</h1>

            <form onSubmit={saveRoute} className="w-full max-w-md bg-white/80 p-6 rounded-2xl shadow-lg">
                    <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Pickup</label>
                    <div className="relative">
                        <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Type pickup location" className="w-full pl-10 pr-4 py-2 rounded-lg border" />
                        <FaMapMarkerAlt className="absolute left-3 top-2 text-blue-600" />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Current address (optional)</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address or landmark" className="w-full pl-3 pr-4 py-2 rounded-lg border" />
                </div>

                {/* Driver location will be captured automatically via browser geolocation when saving the route */}

                <div className="mb-4 grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Vehicle type</label>
                        <input value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder="Car / Bike / Van" className="w-full pl-3 pr-3 py-2 rounded-lg border text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Seats</label>
                        <input type="number" value={seats} min={1} onChange={(e) => setSeats(parseInt(e.target.value || '1'))} className="w-full pl-3 pr-3 py-2 rounded-lg border text-sm" />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Destination</label>
                    <div className="relative">
                        <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Type destination" className="w-full pl-10 pr-4 py-2 rounded-lg border" />
                        <FaCar className="absolute left-3 top-2 text-purple-600" />
                    </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Date</label>
                        <div className="relative">
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full pl-3 pr-3 py-2 rounded-lg border text-sm" />
                            <FaCalendarAlt className="absolute left-3 top-2 text-green-600 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Time (optional)</label>
                        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full pl-3 pr-3 py-2 rounded-lg border text-sm" />
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <button type="submit" className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-semibold">Save & View Requests</button>
                    <button type="button" onClick={() => { setPickup(''); setDestination(''); setDate(''); setTime(''); }} className="flex-1 py-2 rounded-lg bg-gray-200">Clear</button>
                </div>
            </form>
        </div>
    );
}
