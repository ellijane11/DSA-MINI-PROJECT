import React from "react";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#01003d] text-white flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold mb-6">Ride It</h1>
            <Link
                href="/choose"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            >
                <span>Get Started</span>
            </Link>
        </div>
    );
}

