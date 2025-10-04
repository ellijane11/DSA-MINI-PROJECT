"use client";
import React from "react";
import Link from "next/link";

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

export default function BrowsePage() {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('local_users_v1') : null;
    const users = raw ? JSON.parse(raw) : [];
    const passengers = users.filter((u: any) => (u.profession || '').toLowerCase() !== 'driver');
    const drivers = users.filter((u: any) => (u.profession || '').toLowerCase() === 'driver');

    return (
        <div
            className="min-h-screen text-white flex flex-col items-center justify-center"
            style={{
                backgroundImage:
                    "linear-gradient(to right, var(--btn-grad-start), var(--btn-grad-mid), var(--btn-grad-end))",
            }}
        >
            <h1 className="text-3xl font-bold mb-4">🔍 Browse Rides</h1>
            <p>See all available rides and users here.</p>

            <section className="w-full max-w-3xl mt-8 bg-white/10 p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">Drivers</h2>
                {drivers.length === 0 && <p className="text-gray-200">No drivers signed up yet.</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {drivers.map((p: any, idx: number) => (
                        <article key={p.email || idx} className="bg-white/20 p-4 rounded-lg">
                            <div className="font-semibold text-black">{p.name || p.email}</div>
                            <div className="text-sm text-black">{p.email}</div>
                            <div className="text-xs text-black">{p.profession}</div>
                        </article>
                    ))}
                </div>

                <h2 className="text-2xl font-bold mt-6 mb-4">Passengers</h2>
                {passengers.length === 0 && <p className="text-gray-200">No passengers signed up yet.</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {passengers.map((p: any, idx: number) => (
                        <article key={p.email || idx} className="bg-white/20 p-4 rounded-lg">
                            <div className="font-semibold text-black">{p.name || p.email}</div>
                            <div className="text-sm text-black">{p.email}</div>
                            <div className="text-xs text-black">{p.profession}</div>
                        </article>
                    ))}
                </div>
            </section>
            <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-4 z-50 bg-white/10 backdrop-blur-sm shadow-2xl rounded-t-3xl border-t-2 border-white/30">
                <NavLink href="/driver" tooltip="Home">
                    &lt;
                </NavLink>
                <NavLink href="/requests" tooltip="Requests">
                    🔔
                </NavLink>
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
