"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

const mockUser = {
    name: "Nikhil",
    email: "nikhil@email.com",
    phone: "+91 99999 88888",
    photo: "", // Default empty photo
};

export default function ProfilePage() {
    const router = useRouter();
    const [edit, setEdit] = useState(false);
    const [user, setUser] = useState(mockUser);
    const [photo, setPhoto] = useState<string>(user.photo);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Profile image upload preview handler
    const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPhoto(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setEdit(false);
        setUser({ ...user, photo: photo });
        // TODO: Save to backend API or database here
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                backgroundImage:
                    "linear-gradient(to right, #a8edea 0%, #fed6e3 50%, #c3cfe2 100%)",
            }}
        >
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="mb-4 text-blue-600 hover:underline"
                >
                    ← Back
                </button>

                <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                    Profile
                </h2>

                <div className="flex flex-col items-center mb-4">
                    <label className="cursor-pointer group">
                        <div className="relative">
                            <img
                                src={
                                    photo ||
                                    "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name)
                                }
                                alt="Profile"
                                className="w-24 h-24 rounded-full border-4 border-pink-200 mb-2 object-cover"
                            />
                            {edit && (
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <span className="text-white text-xs">Change</span>
                                </div>
                            )}
                        </div>
                        {edit && (
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhoto}
                            />
                        )}
                    </label>
                </div>

                <form className="space-y-3">
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none"
                            disabled={!edit}
                            style={{
                                background: "linear-gradient(90deg, #c3cfe2 0%, #e0c3fc 100%)",
                                color: "black", // Text color fixed here
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none"
                            disabled={!edit}
                            style={{
                                background: "linear-gradient(90deg, #c3cfe2 0%, #e0c3fc 100%)",
                                color: "black", // Text color fixed here
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">
                            Phone
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={user.phone}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none"
                            disabled={!edit}
                            style={{
                                background: "linear-gradient(90deg, #c3cfe2 0%, #e0c3fc 100%)",
                                color: "black", // Text color fixed here
                            }}
                        />
                    </div>
                </form>

                <div className="mt-5 flex justify-between">
                    {!edit ? (
                        <button
                            onClick={() => setEdit(true)}
                            className="flex-1 bg-pink-400 text-white rounded-lg px-4 py-2 hover:bg-pink-500 transition"
                        >
                            Edit
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-blue-400 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition mr-2"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEdit(false)}
                                className="flex-1 bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition ml-2"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
