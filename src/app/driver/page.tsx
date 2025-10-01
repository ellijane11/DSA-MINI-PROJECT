import React from "react";

// The styling is adjusted to display the four buttons in a 2x2 grid layout using Tailwind's grid utilities.
// FIX: Replaced 'next/link' with standard '<a>' tags to resolve compilation error in the sandbox environment.
export default function DriverDashboard() {
    return (

        <div className="min-h-screen text-white flex flex-col items-center justify-center"
             style={{ backgroundImage: "linear-gradient(to right, var(--btn-grad-start), var(--btn-grad-mid), var(--btn-grad-end))",
             }}>
            <h1 className="text-4xl font-extrabold mb-10 text-center tracking-tight">
                🚗 Driver Dashboard
            </h1>

            {/* Grid Container for 2x2 layout */}
            <div className="grid grid-cols-2 gap-6 max-w-lg w-full">

                {/* 1. Manage Rides */}
                <a href="/driver/manage" className="col-span-1">
                    <button
                        className="w-full h-32 py-4 px-3 rounded-xl bg-white text-[#01003d] font-bold text-lg shadow-2xl hover:bg-gray-100 transition duration-200 transform hover:scale-[1.03] flex flex-col items-center justify-center"
                    >
                        {/* Icon for Manage Rides (Car/Route) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 18a2 2 0 0 0 2-2V9.5a2.5 2.5 0 0 0-2.5-2.5h-5A2.5 2.5 0 0 0 7 9.5V16a2 2 0 0 0 2 2h8zm-2 2H9a4 4 0 0 1-4-4v-6a4.5 4.5 0 0 1 4.5-4.5h5A4.5 4.5 0 0 1 19 10v6a4 4 0 0 1-4 4zM4 14H3V7h1V14zM20 7v7h1V7h-1z"/>
                            <path d="M12.5 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                        </svg>
                        Manage Rides
                    </button>
                </a>

                {/* 2. Ride Requests */}
                <a href="/driver/requests" className="col-span-1">
                    <button
                        className="w-full h-32 py-4 px-3 rounded-xl bg-white text-[#01003d] font-bold text-lg shadow-2xl hover:bg-gray-100 transition duration-200 transform hover:scale-[1.03] flex flex-col items-center justify-center"
                    >
                        {/* Icon for Ride Requests (Notification) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-4H8V9h4v3h3v4z"/>
                        </svg>
                        Ride Requests
                    </button>
                </a>

                {/* 3. My Profile */}
                <a href="/driver/profile" className="col-span-1">
                    <button
                        className="w-full h-32 py-4 px-3 rounded-xl bg-white text-[#01003d] font-bold text-lg shadow-2xl hover:bg-gray-100 transition duration-200 transform hover:scale-[1.03] flex flex-col items-center justify-center"
                    >
                        {/* Icon for Profile (User) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        My Profile
                    </button>
                </a>

                {/* 4. Login/Logout */}
                <a href="/driver/login" className="col-span-1">
                    <button
                        className="w-full h-32 py-4 px-3 rounded-xl bg-white text-[#01003d] font-bold text-lg shadow-2xl hover:bg-gray-100 transition duration-200 transform hover:scale-[1.03] flex flex-col items-center justify-center"
                    >
                        {/* Icon for Login/Logout (Exit/Enter) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11 7L9.6 8.4l2.6 2.6H4v2h8.2l-2.6 2.6L11 17l5-5-5-5zm9 7h-2v-4h2v4z"/>
                        </svg>
                        Login / Logout
                    </button>
                </a>
            </div>

            <p className="mt-8 text-white text-4xl">Welcome back, Driver!</p>



        </div>
    );
}

