import React from "react";

// This component uses a 2x2 grid layout with white cards for a clean, driver dashboard-like appearance.
export default function PassengerDashboard() {
    // Note: Replaced 'next/link' with standard '<a>' tags for universal compatibility.
    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center"
             style={{ backgroundImage: "linear-gradient(to right, var(--btn-grad-start), var(--btn-grad-mid), var(--btn-grad-end))",
             }}>
            <h1 className="text-4xl font-extrabold mb-10 text-center tracking-tight">
                🚶 Passenger Dashboard
            </h1>

            {/* Grid Container for 2x2 layout */}
            <div className="grid grid-cols-2 gap-6 max-w-lg w-full">

                {/* 1. Post Destination */}
                <a href="/passenger/destination" className="col-span-1">
                    <button
                        // Shared card style for uniform size and aesthetics
                        className="w-full h-32 py-4 px-3 rounded-xl bg-white text-[#01003d] font-bold text-lg shadow-2xl hover:bg-gray-100 transition duration-200 transform hover:scale-[1.03] flex flex-col items-center justify-center text-center"
                    >
                        {/* Icon for Post Destination (Map Pin) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                        </svg>
                        Post Destination
                    </button>
                </a>

                {/* 2. Join a Ride */}
                <a href="/passenger/join-ride" className="col-span-1">
                    <button
                        className="w-full h-32 py-4 px-3 rounded-xl bg-white text-[#01003d] font-bold text-lg shadow-2xl hover:bg-gray-100 transition duration-200 transform hover:scale-[1.03] flex flex-col items-center justify-center text-center"
                    >
                        {/* Icon for Join a Ride (Shared Trip) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 10h-2V7c0-1.66-1.34-3-3-3s-3 1.34-3 3v3H8c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2zM13 7c0-.55.45-1 1-1s1 .45 1 1v3h-2V7z"/>
                        </svg>
                        Join a Ride
                    </button>
                </a>

                {/* 3. Drop / Pickup Parcel */}
                <a href="/passenger/parcel" className="col-span-1">
                    <button
                        className="w-full h-32 py-4 px-3 rounded-xl bg-white text-[#01003d] font-bold text-lg shadow-2xl hover:bg-gray-100 transition duration-200 transform hover:scale-[1.03] flex flex-col items-center justify-center text-center"
                    >
                        {/* Icon for Parcel (Package/Box) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2c-4.97 0-9 4.03-9 9 0 3.84 2.45 7.15 6 8.49V22h6v-2.51c3.55-1.34 6-4.65 6-8.49 0-4.97-4.03-9-9-9zm-1 15.48c-2.81-.72-5-3.35-5-6.48 0-3.87 3.13-7 7-7s7 3.13 7 7c0 3.13-2.19 5.76-5 6.48V13h-4v4.48z"/>
                        </svg>
                        Drop / Pickup Parcel
                    </button>
                </a>

                {/* 4. Browse Rides */}
                <a href="/passenger/browse" className="col-span-1">
                    <button
                        className="w-full h-32 py-4 px-3 rounded-xl bg-white text-[#01003d] font-bold text-lg shadow-2xl hover:bg-gray-100 transition duration-200 transform hover:scale-[1.03] flex flex-col items-center justify-center text-center"
                    >
                        {/* Icon for Browse Rides (Search) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                        Browse Rides
                    </button>
                </a>
            </div>

            <p className="mt-8 text-gray-300 text-sm">Find your perfect ride!</p>
        </div>
    );
}

