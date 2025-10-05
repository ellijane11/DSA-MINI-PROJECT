"use client";
import React, { useState, useCallback, useEffect } from "react";
import { addRequest } from "../../../lib/requests";
import Link from "next/link";
import Bell from "../../../components/Bell";

// --- Type Definitions ---
type ParcelOption = "pickup" | "drop" | "";

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    tooltip: string;
}

// --- Custom Components ---
const NavLink: React.FC<NavLinkProps> = ({ href, children, tooltip }) => (
    <Link
        href={href}
        className="nav-item text-3xl p-2 cursor-pointer relative transition-transform duration-200 hover:scale-110"
        data-tooltip={tooltip}
    >
        {children}
    </Link>
);

// --- Radio Selector ---
interface ParcelRadioSelectorProps {
    value: ParcelOption;
    checked: boolean;
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ParcelRadioSelector: React.FC<ParcelRadioSelectorProps> = ({
                                                                     value,
                                                                     checked,
                                                                     label,
                                                                     onChange,
                                                                 }) => (
    <label className="flex flex-col items-center gap-2 cursor-pointer relative text-center">
        <input
            type="radio"
            name="parcel-type"
            value={value}
            checked={checked}
            onChange={onChange}
            className="absolute opacity-0 w-full h-full"
        />
        <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center transition-all duration-300">
            <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    checked ? "bg-white" : "bg-transparent"
                }`}
            />
        </div>
        <span className="text-white text-xl font-medium drop-shadow-sm">
      {label}
    </span>
    </label>
);

// --- Main Component ---
export default function PassengerParcelPage() {
    const [selectedOption, setSelectedOption] = useState<ParcelOption>("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropoffLocation, setDropoffLocation] = useState("");
    const [weight, setWeight] = useState("");
    const [notes, setNotes] = useState("");
    const [senderName, setSenderName] = useState("");
    const [senderContact, setSenderContact] = useState("");
    const [recipient, setRecipient] = useState<"driver" | "passenger" | "both">("driver");
    // For demo: coordinates could be added here if using a map
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    const mainGradientStyle = {
        backgroundImage: "linear-gradient(to right, #8aceff, #ffbae9, #d8baff)",
    };

    const sendBtnGradient = "linear-gradient(90deg, #ffbae9, #d8baff)";

    const handleRadioChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedOption(e.target.value as ParcelOption);
        },
        []
    );

    const handleSendRequest = useCallback(() => {
        if (selectedOption && pickupLocation && dropoffLocation) {
            const fromId = typeof window !== 'undefined' ? (localStorage.getItem('current_user_email') || 'guest') : 'guest';
            const fromName = senderName || localStorage.getItem('current_user_email') || 'Guest';
            const routeKey = `${pickupLocation}|${dropoffLocation}|${new Date().toISOString().slice(0,10)}`;
            const payload = {
                fromId,
                fromName,
                type: "parcel" as const,
                pickup: pickupLocation,
                destination: dropoffLocation,
                pickupLat: location?.lat,
                pickupLng: location?.lng,
                seats: 1,
                vehicleType: weight || undefined,
                parcelWeight: weight || undefined,
                parcelNotes: notes || undefined,
                route: routeKey,
            };

            const created: any[] = [];
            if (recipient === "driver" || recipient === "both") {
                const r1 = addRequest({ ...payload, toType: "driver", });
                created.push(r1);
            }
            if (recipient === "passenger" || recipient === "both") {
                const r2 = addRequest({ ...payload, toType: "passenger", });
                created.push(r2);
            }
            alert(`Parcel request created (${created.length}). Drivers/passengers on matching routes will see it.`);
            // clear fields
            setPickupLocation("");
            setDropoffLocation("");
            setWeight("");
            setNotes("");
        }
    }, [selectedOption, pickupLocation, dropoffLocation, location]);

    const isButtonDisabled = !selectedOption || !pickupLocation || !dropoffLocation;

    return (
        <div
            className="min-h-screen text-white flex flex-col items-center justify-center pt-20 pb-20"
            style={mainGradientStyle}
        >
            <h1 className="text-4xl font-extrabold mb-10 text-white drop-shadow-lg tracking-wider">
                Passenger Parcel
            </h1>

            <div className="flex flex-col gap-8 w-[320px] text-center">
                <div className="flex justify-around mb-3">
                    <ParcelRadioSelector
                        value="pickup"
                        checked={selectedOption === "pickup"}
                        onChange={handleRadioChange}
                        label="Pickup Parcel"
                    />
                    <ParcelRadioSelector
                        value="drop"
                        checked={selectedOption === "drop"}
                        onChange={handleRadioChange}
                        label="Drop Parcel"
                    />
                </div>

                <input
                    type="text"
                    placeholder="Pickup Location"
                    className="rounded-lg px-4 py-2 text-black mb-2"
                    value={pickupLocation}
                    onChange={e => setPickupLocation(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Drop-off Location"
                    className="rounded-lg px-4 py-2 text-black mb-2"
                    value={dropoffLocation}
                    onChange={e => setDropoffLocation(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Your name (optional)"
                    className="rounded-lg px-4 py-2 text-black mb-2"
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Contact (email/phone)"
                    className="rounded-lg px-4 py-2 text-black mb-2"
                    value={senderContact}
                    onChange={e => setSenderContact(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Parcel weight / size"
                    className="rounded-lg px-4 py-2 text-black mb-2"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                />
                <textarea
                    placeholder="Notes about parcel"
                    className="rounded-lg px-4 py-2 text-black mb-2 h-20"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                />

                <div className="flex gap-2 mb-2 items-center">
                    <label className="text-white">Send to:</label>
                    <select value={recipient} onChange={(e) => setRecipient(e.target.value as any)} className="text-black rounded p-2">
                        <option value="driver">Drivers</option>
                        <option value="passenger">Passengers</option>
                        <option value="both">Both</option>
                    </select>
                </div>

                <div className="flex gap-2 mb-2">
                    <button onClick={() => {
                        if (!navigator || !navigator.geolocation) {
                            alert('Geolocation not available');
                            return;
                        }
                        navigator.geolocation.getCurrentPosition((pos) => {
                            const lat = pos.coords.latitude;
                            const lng = pos.coords.longitude;
                            setLocation({ lat, lng });
                            setPickupLocation(`lat:${lat.toFixed(5)},lng:${lng.toFixed(5)}`);
                        }, () => alert('Unable to fetch location'));
                    }} className="px-3 py-2 bg-white text-black rounded">Use my location</button>
                    <a target="_blank" rel="noreferrer" href={location ? `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=16/${location.lat}/${location.lng}` : "https://www.openstreetmap.org/"} className="px-3 py-2 bg-white text-black rounded">Open map</a>
                </div>

                {/* Map Preview */}
                <div className="w-full h-40 bg-gray-300 rounded-lg overflow-hidden mb-2">
                    {location ? (
                        <iframe title="map-preview" src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.02}%2C${location.lat-0.01}%2C${location.lng+0.02}%2C${location.lat+0.01}&layer=mapnik&marker=${location.lat}%2C${location.lng}`} className="w-full h-full" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700">Map preview (set location to see)</div>
                    )}
                </div>

                {/* Map Placeholder */}
                <div className="w-full h-40 bg-gray-300 rounded-lg flex items-center justify-center text-gray-700 mb-2">
                    Map will be shown here
                </div>

                <button
                    id="sendRequestBtn"
                    className={`inline-block py-[15px] px-10 rounded-[15px] text-[1.3rem] font-bold text-white border-none shadow-lg transition-all duration-200 ${
                        isButtonDisabled
                            ? "opacity-60 cursor-not-allowed shadow-inner"
                            : "hover:scale-[1.05] hover:shadow-2xl cursor-pointer"
                    }`}
                    disabled={isButtonDisabled}
                    onClick={handleSendRequest}
                    style={{ backgroundImage: sendBtnGradient }}
                >
                    Send Request
                </button>
            </div>

            {/* --- Bottom Nav --- */}
            <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-4 z-50 bg-white/10 backdrop-blur-sm shadow-2xl rounded-t-3xl border-t-2 border-white/30">
                <NavLink href="/passenger" tooltip="Home">
                    &lt;
                </NavLink>
                <div className="nav-item text-3xl p-2">
                    <Bell />
                </div>
                <NavLink href="/profile" tooltip="Profile">
                    👤
                </NavLink>

                <style jsx global>{`
          .nav-item::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 120%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            font-size: 0.75rem;
            padding: 4px 8px;
            border-radius: 6px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
          }
          .nav-item:hover::after {
            opacity: 1;
          }
        `}</style>
            </nav>
        </div>
    );
}

