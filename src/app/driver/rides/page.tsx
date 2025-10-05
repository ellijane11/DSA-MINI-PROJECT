
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Bell from "../../../components/Bell";
import Link from "next/link";
import { getPendingForDrivers, updateRequestStatus, ignoreRequest, addNotification, getAllRequests } from "../../../lib/requests";

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    tooltip: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, tooltip }) => (
    <Link
        href={href}
        className="nav-item text-4xl p-2 cursor-pointer relative transition-transform duration-200 hover:scale-110"
        data-tooltip={tooltip}
    >
        {children}
    </Link>
);

export default function DriverRidesPage() {
    const [pending, setPending] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [routeKey, setRouteKey] = useState<string>("");
    const [storedRoute, setStoredRoute] = useState<string>("");

    const refreshPending = (driverLocOverride?: { lat: number; lng: number } | null) => {
        const current = typeof window !== 'undefined' ? localStorage.getItem('current_user_email') || 'guest' : 'guest';
        const rk = routeKey || (storedRoute || undefined);
        let all = getPendingForDrivers(rk as any, current || undefined) || [];
        // determine driver location: check active_rides_v1 latest for this driver
        try {
            const activeRaw = localStorage.getItem('active_rides_v1');
            const active = activeRaw ? JSON.parse(activeRaw) : [];
            const myActive = active.filter((a: any) => a.driver === current).sort((a: any, b: any) => (b.id || 0) - (a.id || 0))[0];
            let driverLoc: { lat: number; lng: number } | null = null;
            if (driverLocOverride) {
                driverLoc = driverLocOverride;
            } else if (myActive && myActive.location) driverLoc = { lat: myActive.location.lat || 0, lng: myActive.location.lng || 0 };
            else {
                const usersRaw = localStorage.getItem('local_users_v1');
                const users = usersRaw ? JSON.parse(usersRaw) : [];
                const me = users.find((u: any) => (u.email || u.phone) === current);
                if (me && me.location) driverLoc = { lat: me.location.lat || 0, lng: me.location.lng || 0 };
            }

            if (driverLoc) {
                // compute distance to each pending request if they carry pickup coordinates
                const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
                    const toRad = (v: number) => (v * Math.PI) / 180;
                    const R = 6371; // km
                    const dLat = toRad(lat2 - lat1);
                    const dLon = toRad(lon2 - lon1);
                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    return R * c;
                };

                all = all.map((r: any) => {
                    // try pickup location in request (if stored as lat/lng)
                    let dist = Number.POSITIVE_INFINITY;
                    if (r.pickupLat && r.pickupLng) {
                        dist = haversine(driverLoc!.lat, driverLoc!.lng, r.pickupLat, r.pickupLng);
                    } else if (r.location && r.location.lat && r.location.lng) {
                        dist = haversine(driverLoc!.lat, driverLoc!.lng, r.location.lat, r.location.lng);
                    }
                    return { ...r, __distance_km: dist };
                });

                all.sort((a: any, b: any) => (a.__distance_km || Number.POSITIVE_INFINITY) - (b.__distance_km || Number.POSITIVE_INFINITY));
            }
        } catch (e) {
            // ignore
        }
        setPending(all || []);
    };

        // watch driver's live position and refresh list as it changes
        useEffect(() => {
            if (typeof window === 'undefined' || !navigator || !navigator.geolocation) return;
            let watchId: number | null = null;
            try {
                watchId = navigator.geolocation.watchPosition((pos) => {
                    const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    // persist into local active_rides_v1 / local_users_v1 so other pages can read
                    try {
                        const cur = localStorage.getItem('current_user_email') || 'guest';
                        // update active_rides_v1 latest entry for this driver
                        const activeRaw = localStorage.getItem('active_rides_v1');
                        const active = activeRaw ? JSON.parse(activeRaw) : [];
                        const myIdx = active.findIndex((a: any) => a.driver === cur);
                        if (myIdx !== -1) {
                            active[myIdx].location = loc;
                            localStorage.setItem('active_rides_v1', JSON.stringify(active));
                        }
                        const usersRaw = localStorage.getItem('local_users_v1');
                        const users = usersRaw ? JSON.parse(usersRaw) : [];
                        const uidx = users.findIndex((u: any) => (u.email || u.phone) === cur);
                        if (uidx !== -1) {
                            users[uidx].location = loc;
                            localStorage.setItem('local_users_v1', JSON.stringify(users));
                        }
                    } catch (e) {}
                    // refresh UI using this live location
                    refreshPending({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                }, (err) => {
                    // ignore errors silently
                }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 } as PositionOptions);
            } catch (e) {}
            return () => {
                try { if (watchId !== null && navigator && navigator.geolocation) navigator.geolocation.clearWatch(watchId); } catch (e) {}
            };
        }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
    const cur = localStorage.getItem('current_user_email') || 'guest';
    setCurrentUser(cur);
    const stored = localStorage.getItem(`last_route_${cur}`) || '';
    setStoredRoute(stored);
    if (!routeKey && stored) setRouteKey(stored);
    refreshPending();
        const onStorage = (e: StorageEvent) => {
            if (!e || !e.key) { refreshPending(); return; }
            if (e.key === 'ride_requests_v1') {
                refreshPending();
            }
        };
        window.addEventListener('storage', onStorage as any);
        return () => window.removeEventListener('storage', onStorage as any);
    }, []);

    const auth = useAuth();

    // refresh when auth user changes (so profile/location updates reflect immediately)
    useEffect(() => {
        refreshPending();
    }, [auth.user]);

    // persist routeKey edits per-user so the filter stays in sync (like passenger page)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const cur = localStorage.getItem('current_user_email') || 'guest';
            if (routeKey) {
                localStorage.setItem(`last_route_${cur}`, routeKey);
                setStoredRoute(routeKey);
            }
        } catch (e) {}
    }, [routeKey]);

    // refresh when filters / current user change
    useEffect(() => {
        refreshPending();
    }, [routeKey, storedRoute, currentUser]);

    const accept = (id: string) => {
        updateRequestStatus(id, "accepted");
        try {
            const all = getAllRequests();
            const req = all.find(x => x.id === id);
            addNotification({ toId: req?.fromId, fromId: localStorage.getItem('current_user_email') || 'driver', title: 'Your request was accepted', body: `Request ${id} was accepted by a driver.` });
            // set this driver's active ride destination to the accepted request's destination
            try {
                const cur = localStorage.getItem('current_user_email') || 'guest';
                const activeRaw = localStorage.getItem('active_rides_v1');
                const active = activeRaw ? JSON.parse(activeRaw) : [];
                const idx = active.findIndex((a: any) => a.driver === cur);
                if (idx !== -1) {
                    active[idx].destination = req?.destination || '';
                    // optionally store the pickup as well
                    active[idx].pickup = req?.pickup || active[idx].pickup;
                    localStorage.setItem('active_rides_v1', JSON.stringify(active));
                } else {
                    // if no active entry exists, create one representing this accepted ride
                    const usersRaw = localStorage.getItem('local_users_v1');
                    const users = usersRaw ? JSON.parse(usersRaw) : [];
                    const me = users.find((u: any) => (u.email || u.phone) === cur) || {};
                    const loc = me.location || { lat: 0, lng: 0 };
                    active.push({ id: `drv_${Date.now()}`, driver: cur, pickup: req?.pickup || '', destination: req?.destination || '', date: req?.date || '', time: req?.time || '', address: me.address || '', location: loc, vehicleType: req?.vehicleType || '', seats: req?.seats || 1 });
                    localStorage.setItem('active_rides_v1', JSON.stringify(active));
                }
            } catch (e) {}
        } catch (e) {}
        refreshPending();
        alert('You accepted this ride request (demo).');
    };

    const ignore = (id: string) => {
        const cur = typeof window !== 'undefined' ? localStorage.getItem('current_user_email') || 'guest' : 'guest';
        ignoreRequest(id, cur || 'guest');
        refreshPending();
    };

    return (
        <div
            className="min-h-screen text-white flex flex-col items-center justify-center pb-24"
            style={{
                backgroundImage:
                    "linear-gradient(to right, var(--btn-grad-start), var(--btn-grad-mid), var(--btn-grad-end))",
            }}
        >
            <h1 className="text-3xl font-bold mb-4">🛣️ Available Rides</h1>
            <p>Browse all available ride requests and accept them.</p>

            <section className="mt-8 w-full max-w-xl">
                <h2 className="text-xl font-semibold mb-3">Pending Ride Requests</h2>
                <div className="mb-3 text-sm text-gray-200">Filter (pickup|destination|date): <input className="ml-2 p-1 text-black rounded" value={routeKey} onChange={(e) => setRouteKey(e.target.value)} placeholder={storedRoute || 'e.g. Kottayam|Pala|2025-10-04'} /></div>
                {pending.length === 0 && <p className="text-gray-200">No pending ride requests for your destination.</p>}
                <div className="space-y-3">
                    {pending.map((r) => (
                        <div key={r.id} className="p-4 bg-white/10 rounded-lg flex flex-col md:flex-row justify-between items-start">
                            <div className="w-full md:w-3/4">
                                <div className="font-semibold text-lg text-black">{r.fromName || 'Unknown'}</div>
                                <div className="text-xs text-gray-600 mb-2">Request ID: <span className="text-black">{r.id}</span> · From ID: <span className="text-black">{r.fromId || '—'}</span></div>
                                <div className="text-sm text-black">{r.pickup} → {r.destination} {r.__distance_km !== undefined && r.__distance_km !== Number.POSITIVE_INFINITY ? <span className="text-xs text-gray-500">· {r.__distance_km.toFixed(2)} km away</span> : null}</div>
                                <div className="text-sm text-black">Date: {r.date} {r.time ? `· ${r.time}` : ''}</div>
                                <div className="text-sm text-black">Seats: {r.seats || '1'} · Vehicle: {r.vehicleType || 'Any'}</div>
                                <div className="text-sm text-black">Status: {r.status}</div>
                                <div className="mt-2 text-xs text-black">Joined: {(r.joinedBy || []).length} · Passengers: {r.seats || 1} · Created: {r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}</div>
                            </div>
                            <div className="flex gap-2 mt-4 md:mt-0">
                                <button onClick={() => accept(r.id)} className="px-3 py-2 bg-green-500 rounded text-white">Accept</button>
                                <button onClick={() => ignore(r.id)} className="px-3 py-2 bg-red-500 rounded text-white">Ignore</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-4 z-50 bg-white/10 backdrop-blur-sm shadow-2xl rounded-t-3xl border-t-2 border-white/30">
                <NavLink href="/driver" tooltip="Home">
                    &lt;
                </NavLink>
                <div className="nav-item text-4xl p-2">
                    <Bell />
                </div>
                <NavLink href="/driver/map" tooltip="Map">
                    🗺️
                </NavLink>
                <NavLink href="/driver/profile" tooltip="Profile">
                    👤
                </NavLink>

                <style jsx global>{`
                  .nav-item::after {
                    content: attr(data-tooltip);
                    position: absolute;
                    bottom: 120%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: #fff;
                    font-size: 0.75rem;
                    padding: 4px 8px;
                    border-radius: 6px;
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s ease;
                  }
                  .nav-item:hover::after {
                    opacity: 1;
                  }
                `}</style>
            </nav>
        </div>
    );
}
