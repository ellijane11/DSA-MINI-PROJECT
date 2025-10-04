"use client";

import React from 'react';
import Link from 'next/link';

export default function PassengerMapPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white/80 rounded-xl p-6 shadow"> 
        <h1 className="text-2xl font-bold mb-4">Passenger Map (stub)</h1>
        <p className="mb-4">This is a placeholder map view for passengers. We'll integrate Mapbox and realtime updates here.</p>
        <div className="h-96 bg-gray-200 rounded flex items-center justify-center">Map placeholder</div>
        <div className="mt-4">
          <Link href="/passenger" className="text-blue-600">← Back</Link>
        </div>
      </div>
    </div>
  );
}
