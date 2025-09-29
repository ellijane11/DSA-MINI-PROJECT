import Link from "next/link";
import React from "react";

export default function PassengerDashboard() {
    return (
        <div className="h-screen bg-[#01003d] text-white flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-10">🚶 Passenger Dashboard</h1>
            <div className="flex flex-col space-y-4 w-64">
                <Link href="/passenger/destination"><button className="py-3 rounded-lg bg-gradient-to-r from-red-500 to-[#ffde59] text-[#01003d]">Post Destination</button></Link>
                <Link href="/passenger/join-ride"><button className="py-3 rounded-lg bg-gradient-to-r from-red-500 to-[#ffde59] text-[#01003d]">Join a Ride</button></Link>
                <Link href="/passenger/parcel"><button className="py-3 rounded-lg bg-gradient-to-r from-red-500 to-[#ffde59] text-[#01003d]">Drop / Pickup Parcel</button></Link>
                <Link href="/passenger/browse"><button className="py-3 rounded-lg bg-gradient-to-r from-red-500 to-[#ffde59] text-[#01003d]">Browse Rides</button></Link>
            </div>
        </div>
    );
}
