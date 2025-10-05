"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Bell from "../../../components/Bell";
import { getPendingForPassengers, updateRequestStatus, joinRequest, ignoreRequest, addNotification, getAllRequests } from "../../../lib/requests";

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

export default function JoinRidePage() {
    const [pending, setPending] = useState<any[]>([]);
    const [routeKey, setRouteKey] = useState<string>("");
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [storedRoute, setStoredRoute] = useState<string>("");

    const refreshPending = () => {
        const current = typeof window !== 'undefined' ? localStorage.getItem('current_user_email') : null;
        const all = getPendingForPassengers(routeKey || undefined, current || undefined);
        setPending(all);
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const loadForCurrent = () => {
            const cur = localStorage.getItem('current_user_email') || 'guest';
            setCurrentUser(cur);
            const stored = localStorage.getItem(`last_route_${cur}`) || '';
            setStoredRoute(stored);
            if (!routeKey && stored) setRouteKey(stored);
            // refresh pending list for this user/route
            const all = getPendingForPassengers(stored || routeKey || undefined, cur || undefined);
            setPending(all || []);
        };

        // initial load
        loadForCurrent();

        const onStorage = (e: StorageEvent) => {
            // when login or last_route changes in another tab or after login, reload
            if (!e || !e.key) { loadForCurrent(); return; }
            if (e.key === 'current_user_email' || e.key.startsWith('last_route_')) {
                loadForCurrent();
            }
        };

        window.addEventListener('storage', onStorage as any);
        return () => window.removeEventListener('storage', onStorage as any);
    }, [routeKey]);

    // persist routeKey edits per-user so the filter stays in sync
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

    // persist routeKey so returning to page keeps the same filter
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                if (routeKey) localStorage.setItem('last_route', routeKey);
            } catch (e) {}
        }
    }, [routeKey]);

    const join = (id: string) => {
        const current = typeof window !== 'undefined' ? localStorage.getItem('current_user_email') || 'guest' : 'guest';
        joinRequest(id, current);
        refreshPending();
        try {
            const all = getAllRequests();
            const req = all.find(x => x.id === id);
            addNotification({ toId: req?.fromId, fromId: current, title: 'Your request was accepted', body: `A passenger joined your request (${id}).` });
        } catch (e) {}
        alert('You joined this request (demo).');
    };

    const ignore = (id: string) => {
        const current = typeof window !== 'undefined' ? localStorage.getItem('current_user_email') || 'guest' : 'guest';
        ignoreRequest(id, current);
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
            {/* Page Content */}
            <h1 className="text-3xl font-bold mb-4">🚙 Join a Ride</h1>
            <p>Browse available rides and send a request to join.</p>

            {/* Pending requests (for this passenger) */}
            <div className="mt-6 w-full max-w-xl">
                <label className="block text-sm mb-2">Filter by route (pickup|destination|date)</label>
                <input className="w-full p-2 rounded" value={routeKey} onChange={(e) => setRouteKey(e.target.value)} placeholder="e.g. kottayam|pala|2025-10-01" />
                <div className="mt-2 text-sm text-gray-200">
                    <div>Current user: <span className="font-semibold">{currentUser || '—'}</span></div>
                    <div>Stored route for user: <span className="font-semibold">{storedRoute || '—'}</span></div>
                </div>
            </div>
            <section className="mt-8 w-full max-w-xl">
                <h2 className="text-xl font-semibold mb-3">Pending Requests</h2>
                {pending.length === 0 && <p className="text-gray-200">No pending requests from other passengers.</p>}
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
                                <div className="mt-2 text-xs text-black">Joined: {(r.joinedBy || []).length} · Created: {r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}</div>
                            </div>
                            <div className="flex gap-2 mt-4 md:mt-0">
                                <button onClick={() => join(r.id)} className="px-3 py-2 bg-green-500 rounded text-white">Join</button>
                                <button onClick={() => { ignore(r.id); }} className="px-3 py-2 bg-red-500 rounded text-white">Ignore</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-4 z-50 bg-white/10 backdrop-blur-sm shadow-2xl rounded-t-3xl border-t-2 border-white/30">
                <NavLink href="/passenger" tooltip="Home">
                    &lt;
                </NavLink>
                <div className="nav-item text-4xl p-2">
                    <Bell />
                </div>
                <NavLink href="/profile" tooltip="Profile">
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

