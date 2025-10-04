"use client";

import React from "react";
import Link from "next/link";

export default function DevSeedPage() {
  const seed = () => {
    const demo = [
      {
        id: 'req_demo_1',
        fromId: 'pass1',
        fromName: 'Alice',
        toType: 'driver',
        type: 'ride',
        pickup: 'Kottayam',
        destination: 'Pala',
        date: '2025-10-04',
        time: '09:00',
        seats: 2,
        vehicleType: 'Car',
        status: 'pending',
        joinedBy: [],
        ignoredBy: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'req_demo_2',
        fromId: 'pass2',
        fromName: 'Bob',
        toType: 'driver',
        type: 'ride',
        pickup: 'Kottayam',
        destination: 'Ernakulam',
        date: '2025-10-05',
        time: '14:30',
        seats: 1,
        vehicleType: 'Bike',
        status: 'pending',
        joinedBy: [],
        ignoredBy: [],
        createdAt: new Date().toISOString(),
      }
    ];
    try {
      localStorage.setItem('ride_requests_v1', JSON.stringify(demo));
      alert('Seeded demo ride requests.');
    } catch (e) {
      alert('Failed to seed demo requests: ' + e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#01003d] text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Dev: Seed Demo Data</h1>
      <p className="mb-4">Click the button to add demo ride requests to localStorage so you can test driver pages.</p>
      <div className="flex gap-4">
        <button onClick={seed} className="px-4 py-2 bg-green-500 rounded">Seed Demo Requests</button>
        <Link href="/driver/rides" className="px-4 py-2 bg-blue-500 rounded">Open Driver Rides</Link>
      </div>
    </div>
  );
}
