"use client";
import React, { useEffect, useState } from "react";
import { getAllRequests, getNotificationsForUser, updateRequestStatus, addNotification, RideRequest } from "../lib/requests";

type Feedback = {
    id: string;
    fromId?: string; // who submitted
    toId?: string; // who received (driver id/email)
    text: string;
    rating: number;
    createdAt: string;
};

const FEEDBACK_KEY = "feedback_v1";

function readFeedback(): Feedback[] {
    try {
        const r = typeof window !== 'undefined' ? localStorage.getItem(FEEDBACK_KEY) : null;
        return r ? JSON.parse(r) : [];
    } catch (e) {
        return [];
    }
}

function writeFeedback(list: Feedback[]) {
    try {
        if (typeof window === 'undefined') return;
        localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
        // trigger storage listeners
        window.dispatchEvent(new StorageEvent('storage', { key: FEEDBACK_KEY, newValue: JSON.stringify(list) } as any));
    } catch (e) {}
}

export default function RequestsPanel() {
    const [visible, setVisible] = useState(false);
    const [openSection, setOpenSection] = useState<"rides" | "parcels" | "feedback" | null>(null);
    const [rides, setRides] = useState<RideRequest[]>([]);
    const [parcels, setParcels] = useState<RideRequest[]>([]);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [newFeedbackText, setNewFeedbackText] = useState("");
    const [newFeedbackRating, setNewFeedbackRating] = useState(0);
    const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

    const userId = typeof window !== 'undefined' ? (localStorage.getItem('current_user_email') || null) : null;

    useEffect(() => {
        function onToggle(ev: Event) {
            // custom event simply opens panel
            if ((ev as CustomEvent)?.type === 'open-requests-panel') {
                setVisible(true);
            }
        }
        window.addEventListener('open-requests-panel', onToggle as EventListener);

        const onStorage = () => refreshAll();
        window.addEventListener('storage', onStorage);

        // also allow Escape to close
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setVisible(false); };
        window.addEventListener('keydown', onKey);

        refreshAll();
        return () => {
            window.removeEventListener('open-requests-panel', onToggle as any);
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('keydown', onKey);
        };
    }, []);

    function refreshAll() {
        try {
            const all = getAllRequests() as RideRequest[];
            // rides the user joined
            const joinedRides = all.filter((r) => Array.isArray(r.joinedBy) && userId ? r.joinedBy!.includes(userId) : false);
            // rides the user created and were accepted (as driver)
            const acceptedRides = all.filter((r) => r.status === 'accepted' && r.toType === 'driver' && userId ? r.fromId === userId : false);
            // passenger view: rides they joined
            const passengerJoined = all.filter((r) => Array.isArray(r.joinedBy) && userId ? r.joinedBy!.includes(userId) : false);

            const acceptedParcels = all.filter((r) => r.type === 'parcel' && r.status === 'accepted' && (userId ? (r.fromId === userId || (Array.isArray(r.joinedBy) && r.joinedBy!.includes(userId))) : true));

            // dedupe by id while preserving order
            const pushUnique = (acc: RideRequest[], item: RideRequest) => {
                if (!acc.find(x => x.id === item.id)) acc.push(item);
                return acc;
            };
            const combinedRides: RideRequest[] = [];
            [...joinedRides, ...acceptedRides, ...passengerJoined].forEach(r => pushUnique(combinedRides, r));
            const uniqueParcels: RideRequest[] = [];
            acceptedParcels.forEach(p => pushUnique(uniqueParcels, p));

            setRides(combinedRides);
            setParcels(uniqueParcels);
            setFeedbacks(readFeedback());
        } catch (err) {
            // ignore
        }
    }

    function toggleSection(sec: "rides" | "parcels" | "feedback") {
        setOpenSection(openSection === sec ? null : sec);
    }

    function submitFeedback(forDriverId?: string) {
        if (!userId) return alert('You must be logged in to submit feedback');
        if (!forDriverId) return alert('Select a driver');
        const list = readFeedback();
        const fb: Feedback = { id: `fb_${Date.now()}`, fromId: userId, toId: forDriverId, text: newFeedbackText, rating: newFeedbackRating, createdAt: new Date().toISOString() };
        list.unshift(fb);
        writeFeedback(list);
        setNewFeedbackText("");
        setNewFeedbackRating(0);
        setSelectedDriver(null);
        setFeedbacks(list);
        // notify driver
        try { addNotification({ toId: forDriverId, fromId: userId, title: 'New feedback received', body: `You received feedback from ${userId}` }); } catch (e) {}
        alert('Feedback submitted');
    }

    function closePanel() { setVisible(false); setOpenSection(null); }

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={closePanel} />
            <div className="relative w-full md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-auto bg-white rounded-2xl p-6 shadow-xl z-60 text-black">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-black">Requests & Feedback</h2>
                    <div className="flex items-center gap-3">
                        <button className="px-3 py-1 bg-gray-100 rounded" onClick={() => { localStorage.setItem('notifications_v1', JSON.stringify(getNotificationsForUser(userId || undefined))); }}>Sync</button>
                        <button className="px-3 py-1 bg-red-100 rounded" onClick={closePanel}>Close</button>
                    </div>
                </div>

                <div className="space-y-3">
                    <button aria-expanded={openSection === 'rides'} onClick={() => toggleSection('rides')} className="w-full text-left px-4 py-3 bg-gray-50 rounded-md font-semibold">Rides ({rides.length})</button>
                    {openSection === 'rides' && (
                        <div className="p-4 bg-white border rounded-md space-y-3">
                            {rides.length === 0 && <div className="text-sm text-gray-500">No rides found.</div>}
                            {rides.map(r => (
                                <div key={r.id} className="p-3 border rounded flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold">{r.fromName || r.id}</div>
                                        <div className="text-sm text-gray-600">{r.pickup || r.route || ''}</div>
                                        <div className="text-xs text-gray-400">Status: {r.status}</div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => { updateRequestStatus(r.id, 'accepted'); refreshAll(); }} className="px-3 py-1 bg-green-500 text-white rounded">Mark Accepted</button>
                                        <button onClick={() => { updateRequestStatus(r.id, 'rejected'); refreshAll(); }} className="px-3 py-1 bg-red-500 text-white rounded">Mark Rejected</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <button aria-expanded={openSection === 'parcels'} onClick={() => toggleSection('parcels')} className="w-full text-left px-4 py-3 bg-gray-50 rounded-md font-semibold">Parcels ({parcels.length})</button>
                    {openSection === 'parcels' && (
                        <div className="p-4 bg-white border rounded-md space-y-3">
                            {parcels.length === 0 && <div className="text-sm text-gray-500">No parcels found.</div>}
                            {parcels.map(p => (
                                <div key={p.id} className="p-3 border rounded flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold">{p.fromName || p.id}</div>
                                        <div className="text-sm text-gray-600">{p.parcelNotes || p.route || ''}</div>
                                        <div className="text-xs text-gray-400">Status: {p.status}</div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => { updateRequestStatus(p.id, 'accepted'); refreshAll(); }} className="px-3 py-1 bg-green-500 text-white rounded">Mark Accepted</button>
                                        <button onClick={() => { updateRequestStatus(p.id, 'rejected'); refreshAll(); }} className="px-3 py-1 bg-red-500 text-white rounded">Mark Rejected</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <button aria-expanded={openSection === 'feedback'} onClick={() => toggleSection('feedback')} className="w-full text-left px-4 py-3 bg-gray-50 rounded-md font-semibold">Feedback ({feedbacks.length})</button>
                    {openSection === 'feedback' && (
                        <div className="p-4 bg-white border rounded-md space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Select Driver</label>
                                <select value={selectedDriver || ''} onChange={(e) => setSelectedDriver(e.target.value)} className="w-full p-2 border rounded">
                                    <option value="">-- Choose driver --</option>
                                    {/* Drivers are inferred from requests where toType === 'driver' and have a fromId */}
                                        {(() => {
                                            const all = getAllRequests() as RideRequest[];
                                            const ids = Array.from(new Set(all.filter(r => r.toType === 'driver' && r.fromId).map(r => r.fromId))) as string[];
                                            return ids.map((d) => (<option key={d} value={d}>{d}</option>));
                                        })()}
                                </select>
                                <textarea value={newFeedbackText} onChange={(e)=>setNewFeedbackText(e.target.value)} className="w-full p-2 border rounded" placeholder="Write feedback..." />
                                <div className="flex items-center gap-2">
                                    <label className="text-sm">Rating</label>
                                    <select value={newFeedbackRating} onChange={(e)=>setNewFeedbackRating(Number(e.target.value))} className="p-2 border rounded">
                                        <option value={0}>0</option>
                                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                    <button onClick={() => submitFeedback(selectedDriver || undefined)} className="px-3 py-1 bg-blue-500 text-white rounded">Submit</button>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-semibold mb-2">Past feedback</h4>
                                {feedbacks.length === 0 && <div className="text-sm text-gray-500">No feedback yet.</div>}
                                <div className="space-y-2">
                                    {feedbacks.map(f => (
                                        <div key={f.id} className="p-2 border rounded">
                                            <div className="text-sm font-semibold">To: {f.toId} — Rating: {f.rating}</div>
                                            <div className="text-xs text-gray-600">{f.text}</div>
                                            <div className="text-xs text-gray-400">{new Date(f.createdAt).toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
