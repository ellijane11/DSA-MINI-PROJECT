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

export default function JoinRidePage() {
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

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-4 z-50 bg-white/10 backdrop-blur-sm shadow-2xl rounded-t-3xl border-t-2 border-white/30">
                <NavLink href="/passenger" tooltip="Home">
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

