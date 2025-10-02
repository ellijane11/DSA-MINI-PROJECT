"use client";

import React, { useState } from "react";
import { FaTruck, FaTaxi, FaCommentDots } from "react-icons/fa";

interface Person {
    id: string;
    name: string;
}

const ridePeople: Person[] = [
    { id: "r1", name: "Driver One" },
    { id: "r2", name: "Driver Two" },
];
const parcelPeople: Person[] = [
    { id: "p1", name: "Driver Three" },
    { id: "p2", name: "Driver Four" },
];

export default function RequestsPage() {
    const [openDropdown, setOpenDropdown] = useState<"rides" | "parcels" | "feedback" | null>(null);
    const [selectedFeedbackPerson, setSelectedFeedbackPerson] = useState<Person | null>(null);
    const [feedbackText, setFeedbackText] = useState("");
    const [feedbackRating, setFeedbackRating] = useState(0);

    const toggleDropdown = (tab: "rides" | "parcels" | "feedback") => {
        setOpenDropdown(openDropdown === tab ? null : tab);
    };

    const submitFeedback = () => {
        if (!selectedFeedbackPerson) {
            alert("Please select a person to give feedback.");
            return;
        }
        alert(
            `Feedback submitted for ${selectedFeedbackPerson.name}\nRating: ${feedbackRating} stars\nComment: ${feedbackText}`
        );
        setFeedbackText("");
        setFeedbackRating(0);
        setSelectedFeedbackPerson(null);
        setOpenDropdown(null);
    };

    const buttonBaseClasses =
        "flex items-center gap-3 px-6 py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-[1.05] cursor-pointer select-none";

    return (
        <div className="min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 p-8 flex flex-col items-center">
            <h1 className="text-5xl font-extrabold text-white mb-10 drop-shadow-lg">Requests & Feedback</h1>

            {/* Buttons */}
            <div className="flex gap-8 mb-12">
                <button
                    onClick={() => toggleDropdown("rides")}
                    className={`${buttonBaseClasses} bg-white text-pink-500`}
                    aria-expanded={openDropdown === "rides"}
                >
                    <FaTaxi size={24} />
                    Accepted Rides
                </button>
                <button
                    onClick={() => toggleDropdown("parcels")}
                    className={`${buttonBaseClasses} bg-white text-purple-600`}
                    aria-expanded={openDropdown === "parcels"}
                >
                    <FaTruck size={24} />
                    Accepted Parcels
                </button>
                <button
                    onClick={() => toggleDropdown("feedback")}
                    className={`${buttonBaseClasses} bg-white text-blue-600`}
                    aria-expanded={openDropdown === "feedback"}
                >
                    <FaCommentDots size={24} />
                    Feedback
                </button>
            </div>

            {/* Dropdown Panels */}
            {openDropdown && (
                <section
                    className="w-full max-w-5xl bg-white rounded-3xl p-10 shadow-xl relative"
                    aria-label={`${openDropdown} panel`}
                >
                    {openDropdown === "rides" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {ridePeople.map((p) => (
                                <article
                                    key={p.id}
                                    className="border border-pink-400 rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer text-pink-600 font-semibold text-lg"
                                >
                                    {p.name}
                                </article>
                            ))}
                            {ridePeople.length === 0 && <p className="text-center text-gray-600">No ride requests.</p>}
                        </div>
                    )}

                    {openDropdown === "parcels" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {parcelPeople.map((p) => (
                                <article
                                    key={p.id}
                                    className="border border-purple-500 rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer text-purple-600 font-semibold text-lg"
                                >
                                    {p.name}
                                </article>
                            ))}
                            {parcelPeople.length === 0 && <p className="text-center text-gray-600">No parcel requests.</p>}
                        </div>
                    )}

                    {openDropdown === "feedback" && (
                        <div className="max-w-3xl mx-auto space-y-8">
                            <label className="block text-gray-700 text-lg font-bold">Select Person</label>
                            <select
                                value={selectedFeedbackPerson?.id || ""}
                                onChange={(e) => {
                                    const person = [...ridePeople, ...parcelPeople].find((p) => p.id === e.target.value);
                                    setSelectedFeedbackPerson(person || null);
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg text-lg outline-none focus:ring-2 focus:ring-pink-400"
                            >
                                <option value="">-- Choose --</option>
                                {[...ridePeople, ...parcelPeople].map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>

                            <label className="block text-gray-700 text-lg font-bold">Feedback</label>
                            <textarea
                                className="w-full p-4 border border-gray-300 rounded-lg h-32 resize-none outline-none focus:ring-2 focus:ring-pink-400"
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                placeholder="Write your feedback here..."
                            />

                            <label className="block text-gray-700 text-lg font-bold">Rating</label>
                            <select
                                value={feedbackRating}
                                onChange={(e) => setFeedbackRating(Number(e.target.value))}
                                className="w-32 p-3 border border-gray-300 rounded-lg text-lg outline-none focus:ring-2 focus:ring-pink-400"
                            >
                                <option value={0}>Select rating</option>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <option key={star} value={star}>
                                        {star} Star{star > 1 ? "s" : ""}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={submitFeedback}
                                className="block mx-auto px-8 py-3 bg-pink-500 text-white rounded-xl font-bold text-lg hover:bg-pink-600 shadow-lg transition"
                            >
                                Submit
                            </button>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
