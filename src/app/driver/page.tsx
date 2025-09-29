import Link from "next/link";
import React from "react";

export default function DriverDashboard() {
    return (
        <div className="h-screen bg-[#01003d] text-white flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-10">🚗 Driver Dashboard</h1>
            <div className="flex flex-col space-y-4 w-64">
                <Link href="/driver/rides"><button className="py-3 rounded-lg bg-gradient-to-r from-red-500 to-[#ffde59] text-[#01003d]">Manage Rides</button></Link>
                <Link href="/driver/requests"><button className="py-3 rounded-lg bg-gradient-to-r from-red-500 to-[#ffde59] text-[#01003d]">Ride Requests</button></Link>
                <Link href="/driver/profile"><button className="py-3 rounded-lg bg-gradient-to-r from-red-500 to-[#ffde59] text-[#01003d]">My Profile</button></Link>
            </div>
        </div>
    );
}
