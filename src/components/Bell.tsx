"use client";
import React, { useEffect, useState, useRef } from "react";
import { getNotificationsForUser, markNotificationRead } from "../lib/requests";

export default function Bell() {
    const [open, setOpen] = useState(false);
    const [notifs, setNotifs] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const ref = useRef<HTMLDivElement | null>(null);

    const load = () => {
        const cur = typeof window !== 'undefined' ? (localStorage.getItem('current_user_email') || 'guest') : 'guest';
        const all = getNotificationsForUser(cur || undefined) || [];
        setNotifs(all.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setUnreadCount(all.filter(n => !n.read).length);
    };

    useEffect(() => {
        load();
        const onStorage = (e: StorageEvent) => {
            if (!e || !e.key) { load(); return; }
            if (e.key === 'notifications_v1' || e.key === 'current_user_email') load();
        };
        window.addEventListener('storage', onStorage as EventListener);
        return () => window.removeEventListener('storage', onStorage as EventListener);
    }, []);

    useEffect(() => {
        function onDocClick(ev: MouseEvent) {
            if (!ref.current) return;
            if (!ref.current.contains(ev.target as Node)) setOpen(false);
        }
        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, []);

    const toggle = (e?: React.MouseEvent<HTMLButtonElement>) => {
        e?.stopPropagation();
        // open local dropdown
        setOpen(!open);
        // also dispatch global requests panel opener so bell works from anywhere
        try {
            window.dispatchEvent(new CustomEvent('open-requests-panel'));
        } catch (_err) {}
    };

    const markRead = (id: string) => {
        markNotificationRead(id);
        load();
    };

    return (
        <div ref={ref} className="relative">
            <button onClick={toggle} className="relative p-2 rounded-full bg-white/10">
                🔔
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{unreadCount}</span>
                )}
            </button>

            {open && (
                <div className="absolute bottom-14 right-0 w-80 max-h-72 overflow-auto bg-white rounded-lg shadow-lg p-3 z-50">
                    <h4 className="font-semibold mb-2">Notifications</h4>
                    {notifs.length === 0 && <div className="text-sm text-gray-500">No notifications</div>}
                    <ul className="space-y-2">
                        {notifs.map((n) => (
                            <li key={n.id} className={`p-2 rounded ${n.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm font-semibold">{n.title}</div>
                                        <div className="text-xs text-gray-600">{n.body}</div>
                                        <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                                    </div>
                                    {!n.read && (
                                        <button onClick={() => markRead(n.id)} className="ml-2 text-xs px-2 py-1 bg-green-500 text-white rounded">Mark</button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
