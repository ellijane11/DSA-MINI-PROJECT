"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";




// User type
type LocalUser = { email: string; password: string; name: string; profession: string };

const USERS_KEY = "local_users_v1";

function getUsers(): LocalUser[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(USERS_KEY);
        return raw ? (JSON.parse(raw) as LocalUser[]) : [];
    } catch (e) {
        return [];
    }
}

function saveUsers(users: LocalUser[]) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
        // ignore write errors
    }
}

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [profession, setProfession] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    // (removed: hiding the Sign Up toggle based on a stored flag so users can always access sign up)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        setTimeout(() => {
            const users = getUsers();
            if (isLogin) {
                // Login logic
                const user = users.find((u) => u.email === email && u.password === password);
                if (user) {
                    setMessage("Login successful ✅");
                    if (typeof window !== "undefined") {
                        try { localStorage.setItem('current_user_email', email); } catch (e) {}
                    }
                    setTimeout(() => router.push("/choose"), 1500);
                } else {
                    setMessage("User not found or incorrect password ❌");
                }
            } else {
                // Sign up logic
                if (users.find((u) => u.email === email)) {
                    setMessage("Email already registered ❌");
                } else if (password !== confirmPassword) {
                    setMessage("Passwords do not match ❌");
                } else {
                    const next = [...users, { email, password, name, profession }];
                    saveUsers(next);
                    setMessage("Sign Up successful ✅");
                    if (typeof window !== "undefined") {
                        localStorage.setItem("signedUp", "true");
                        try { localStorage.setItem('current_user_email', email); } catch (e) {}
                    }
                    setTimeout(() => {
                        setIsLogin(true);
                        setMessage("");
                        setEmail("");
                        setPassword("");
                        setName("");
                        setProfession("");
                        setConfirmPassword("");
                        router.push("/choose");
                    }, 1500);
                }
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                backgroundImage:
                    "linear-gradient(to right, var(--btn-grad-start), var(--btn-grad-mid), var(--btn-grad-end))",
            }}
        >
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {isLogin ? "Login" : "Sign Up"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Profession
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your profession"
                                    value={profession}
                                    onChange={e => setProfession(e.target.value)}
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                required
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>
                {message && (
                    <p className={`mt-4 text-center text-sm font-semibold ${message.includes("❌") ? "text-red-600" : "text-green-600"}`}>
                        {message}
                    </p>
                )}
                <p className="text-center text-sm mt-6 text-gray-700">
                    {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setMessage("");
                            }}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            {isLogin ? "Sign Up" : "Login"}
                        </button>
                </p>
            </div>
        </div>
    );
}

