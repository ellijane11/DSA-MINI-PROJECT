import React from "react";
import Link from "next/link";
import "./globals.css";

export default function HomePage() {
    return (
        <div className="welcome-container">
            <h1 className="title">Ride It</h1>
            <Link href="/role" className="start-btn">
                <span>Get Started</span>
            </Link>
        </div>
    );
}
