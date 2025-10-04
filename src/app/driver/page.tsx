"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function DriverDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 relative">

      {/* Top Heading */}
      <header className="p-6 text-center">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
          Driver Dashboard
        </h1>
      </header>

      {/* Main content with glassmorphism */}
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="grid grid-cols-2 gap-6 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-6 w-full max-w-lg">

          {/* Select Destination */}
          <button
            onClick={() => router.push("/driver/select-destination")}
            className="bg-white/40 backdrop-blur-sm shadow-lg rounded-xl p-6 text-center hover:shadow-xl hover:scale-[1.03] transition transform"
          >
            <div className="text-3xl">📍</div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Select Destination
            </h2>
            <p className="text-gray-700 text-sm">Choose where you're going</p>
          </button>

          {/* Join a Ride */}
          <button
            onClick={() => router.push("/driver/rides")}
            className="bg-white/40 backdrop-blur-sm shadow-lg rounded-xl p-6 text-center hover:shadow-xl hover:scale-[1.03] transition transform"
          >
            <div className="text-3xl">🚗</div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Join a Ride
            </h2>
            <p className="text-gray-700 text-sm">Find rides to join</p>
          </button>

          {/* Drop/Pickup Parcel */}
          <button
            onClick={() => router.push("/driver/parcel")}
            className="bg-white/40 backdrop-blur-sm shadow-lg rounded-xl p-6 text-center hover:shadow-xl hover:scale-[1.03] transition transform"
          >
            <div className="text-3xl">📦</div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
              Drop/Pickup Parcel
            </h2>
            <p className="text-gray-700 text-sm">Send packages easily</p>
          </button>

          {/* Browse */}
          <button
            onClick={() => router.push("/driver/browse")}
            className="bg-white/40 backdrop-blur-sm shadow-lg rounded-xl p-6 text-center hover:shadow-xl hover:scale-[1.03] transition transform"
          >
            <div className="text-3xl">🔍</div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
              Browse
            </h2>
            <p className="text-gray-700 text-sm">See all available rides</p>
          </button>
        </div>
      </div>

      {/* Bottom Nav Bar (icons only, small height) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md text-[#01003d] flex justify-around items-center h-12 rounded-t-xl shadow-md">
        {/* Back */}
        <a href="/choose" className="text-2xl font-bold hover:text-blue-600">
          &lt;
        </a>

        {/* Requests */}
        <a href="/driver/requests" className="text-2xl hover:text-blue-600">
          🔔
        </a>

        {/* Profile */}
        <a href="/driver/profile" className="text-2xl hover:text-blue-600">
          👤
        </a>
      </div>
    </div>
  );
}
