"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaMapMarkerAlt, FaCalendarAlt, FaTaxi, FaBusAlt, FaCar } from 'react-icons/fa';
import { addRequest } from "../../../lib/requests";
// Note: You may need to install react-icons: npm install react-icons

// --- Type Definitions ---

interface FormData {
    pickup: string;
    destination: string;
    date: string;
    passengers: string;
    selectedOption: "Auto" | "Cab" | "Both" | "";
}

interface ButtonWithGradientBorderProps {
    children: React.ReactNode;
    type: "submit" | "button";
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    gradientStyle: string;
}

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    gradientStyle: string;
}

// --- Custom Components ---

const ButtonWithGradientBorder: React.FC<ButtonWithGradientBorderProps> = ({ children, type, onClick, gradientStyle }) => (
    <div
        className="flex-1 p-[2px] rounded-xl shadow-lg"
        style={{ backgroundImage: gradientStyle }}
    >
        <button
            type={type}
            onClick={onClick}
            className="w-full py-3 rounded-xl font-bold bg-white text-gray-800 transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100"
        >
            {children}
        </button>
    </div>
);

const NavLink: React.FC<NavLinkProps> = ({ href, children, gradientStyle }) => (
    <Link
        href={href}
        className="text-3xl p-2 transition-transform duration-200 hover:scale-110"
        style={{
            backgroundImage: gradientStyle,
            WebkitBackgroundClip: 'text',

            backgroundClip: 'text',
        }}
    >
        {children}
    </Link>
);

// --- Main Component ---

export default function PassengerDestination() {
    const [formData, setFormData] = useState<FormData>({
        pickup: "",
        destination: "",
        date: "",
        passengers: "",
        selectedOption: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name as keyof FormData]: value }));
    };

    const handleOptionClick = (option: "Auto" | "Cab" | "Both") => {
        setFormData(prev => ({ ...prev, selectedOption: option }));
    };

    const handleSendToPassengers = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log("Sending to passengers:", formData);
        const routeKey = `${formData.pickup}|${formData.destination}|${formData.date}`;
        const current = typeof window !== 'undefined' ? localStorage.getItem('current_user_email') || 'passenger_demo' : 'passenger_demo';
        addRequest({
            fromId: current,
            fromName: "Passenger (demo)",
            toType: "passenger",
            type: "ride",
            route: routeKey,
            pickup: formData.pickup,
            destination: formData.destination,
            date: formData.date,
            time: (formData as any).time || '',
            seats: Number(formData.passengers) || 1,
            vehicleType: formData.selectedOption || '',
        });
        try { 
            const cur = localStorage.getItem('current_user_email') || 'guest';
            localStorage.setItem(`last_route_${cur}`, routeKey);
        } catch (e) {}
        alert("Request sent to passengers!");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sending to drivers:", formData);
        const current = typeof window !== 'undefined' ? localStorage.getItem('current_user_email') || 'passenger_demo' : 'passenger_demo';
        addRequest({
            fromId: current,
            fromName: "Passenger (demo)",
            toType: "driver",
            type: "ride",
            route: `${formData.pickup}|${formData.destination}|${formData.date}`,
        });
        try { 
            const cur = localStorage.getItem('current_user_email') || 'guest';
            localStorage.setItem(`last_route_${cur}`, `${formData.pickup}|${formData.destination}|${formData.date}`);
        } catch (e) {}
        alert("Request sent to drivers!");
    };

    const mainGradient = "linear-gradient(to right, var(--btn-grad-start), var(--btn-grad-mid), var(--btn-grad-end))";
    const btnGradient = "linear-gradient(90deg, #8aceff, #ffbae9, #d8baff)";

    return (
        <div
            className="min-h-screen text-black flex flex-col items-center pt-10 pb-20 px-4"
            style={{ backgroundImage: mainGradient }}
        >
            {/* Title Section */}
            <h1 className="text-4xl font-extrabold mb-10 text-white drop-shadow-lg tracking-wider">
                Passenger Destination
            </h1>

            {/* Form Card (Frosted Glass Effect) */}
            <div className="w-full max-w-sm mx-auto p-6 rounded-3xl shadow-2xl backdrop-blur-md bg-white/30 border border-white/40">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Pickup & Destination */}
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                id="pickup"
                                name="pickup"
                                placeholder="Type pickup location"
                                required
                                value={formData.pickup}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/70 border border-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                            />
                            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500" />
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                id="destination"
                                name="destination"
                                placeholder="Type destination"
                                required
                                value={formData.destination}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/70 border border-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                            />
                            <FaCar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
                        </div>
                    </div>

                    {/* Date Input with FIX for Overlap */}
                    <div className="relative">
                        <input
                            type="date"
                            id="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleInputChange}
                            // FIX: Hide native text when empty and ensure consistent styling
                            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/70 border border-gray-300 text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-300 transition 
                                ${formData.date === "" ? "text-transparent" : ""}`}
                        />
                        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 pointer-events-none" />
                        {/* FIX: Only show custom placeholder if the field is empty (to prevent overlap) */}
                        {formData.date === "" && (
                            <span className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none">dd-mm-yyyy</span>
                        )}
                    </div>

                    {/* Ride Options with FIX for Alignment */}
                    <div className="flex gap-2 justify-between mt-4 p-2 bg-white/50 rounded-xl shadow-inner">
                        {/* Define options with a consistent structure */}
                        {([
                            { label: "Auto", icon: <FaBusAlt /> },
                            { label: "Cab", icon: <FaTaxi /> },
                            { label: "Both", icon: null }
                        ] as const).map(({ label, icon }) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => handleOptionClick(label as "Auto" | "Cab" | "Both")}
                                className={`flex flex-col items-center flex-1 py-3 rounded-xl font-semibold transition-all duration-200 
                                ${formData.selectedOption === label
                                    ? "bg-white text-black shadow-lg ring-2 ring-pink-500 transform scale-105"
                                    : "bg-gray-100/50 text-gray-700 hover:bg-white/80"
                                }`}
                            >
                                {/* FIX: Always render a span with a height to reserve space for the icon */}
                                <span className="text-xl mb-1 h-6 flex items-center justify-center">
                                    {icon}
                                </span>
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Passengers Input */}
                    <div className="relative">
                        <input
                            type="number"
                            id="passengers"
                            name="passengers"
                            min="1"
                            max="10"
                            placeholder="Enter number of passengers"
                            required
                            value={formData.passengers}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-xl bg-white/70 border border-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <ButtonWithGradientBorder type="submit" gradientStyle={btnGradient}>
                            Send request to drivers
                        </ButtonWithGradientBorder>
                        <ButtonWithGradientBorder type="button" onClick={handleSendToPassengers} gradientStyle={btnGradient}>
                            Send request to passengers
                        </ButtonWithGradientBorder>
                    </div>
                </form>
            </div>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-4 z-50 bg-white/10 backdrop-blur-sm shadow-2xl rounded-t-3xl border-t-2 border-white/30">
                <NavLink href="/passenger" gradientStyle={btnGradient}>
                    &lt;
                </NavLink>
                <NavLink href="/requests" gradientStyle={btnGradient}>
                    <span className="text-2xl"> 🔔</span>
                </NavLink>
                <NavLink href="/profile" gradientStyle={btnGradient}>
                    👤
                </NavLink>
            </nav>
        </div>
    );
}
