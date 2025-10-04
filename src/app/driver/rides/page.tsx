
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getPendingForDrivers, updateRequestStatus, ignoreRequest } from "../../../lib/requests";

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

    const refreshPending = () => {
        const current = typeof window !== 'undefined' ? localStorage.getItem('current_user_email') || 'guest' : 'guest';
        const rk = routeKey || (storedRoute || undefined);
        const all = getPendingForDrivers(rk as any, current || undefined);
        setPending(all || []);
    };

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
                                <div className="text-sm text-black">{r.pickup} → {r.destination}</div>
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
                <NavLink href="/driver/requests" tooltip="Requests">
                    🔔
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
