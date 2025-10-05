"use client";
import React, { useState, useCallback } from "react";
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
        if (selectedOption) {
            alert(`Request sent for ${selectedOption} parcel! (demo placeholder)`);
        }
    }, [selectedOption]);

    const isButtonDisabled = !selectedOption;

    return (
        <div
            className="min-h-screen text-white flex flex-col items-center justify-center pt-20 pb-20"
            style={mainGradientStyle}
        >
            <h1 className="text-4xl font-extrabold mb-10 text-white drop-shadow-lg tracking-wider">
              Parcel
            </h1>

            <div className="flex flex-col gap-10 w-[240px] text-center">
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
                <NavLink href="/driver" tooltip="Home">
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
