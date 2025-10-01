import React from "react";
import Link from "next/link"; // ✅ This line is required

export default function HomePage() {
    return (
        <div
            className="min-h-screen text-white flex flex-col items-center justify-center"
            style={{
                backgroundImage:
                    "linear-gradient(to right, var(--btn-grad-start), var(--btn-grad-mid), var(--btn-grad-end))",
            }}
        >
            <h1 className="text-[100px] font-bold mb-10">Ride It</h1>
            <Link
                href="/choose"
                className="bg-purple-400 text-white px-12 py-6 rounded-2xl shadow-xl hover:bg-purple-500 transition-colors duration-200 text-2xl font-[cursive] w-[250px] text-center"


            >
                <span>Get Started</span>
            </Link>

        </div>
    );
}



