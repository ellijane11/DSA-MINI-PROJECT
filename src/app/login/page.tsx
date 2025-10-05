"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";




// User type
type LocalUser = { email?: string; phone?: string; password: string; name: string; profession: string };

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
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();
    const auth = useAuth();

    // (removed: hiding the Sign Up toggle based on a stored flag so users can always access sign up)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        setTimeout(() => {
            const users = getUsers();
            if (isLogin) {
                const identifier = email || phone;
                if (!identifier) {
                    setMessage('Please enter email or phone to login');
                    setLoading(false);
                    return;
                }
                // try backend first (promise chain)
                fetch('/api/users/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier, password }) })
                    .then(r => r.json().then(data => ({ status: r.ok, data })).catch(() => ({ status: r.ok, data: null })))
                    .then((resObj: any) => {
                        if (resObj && resObj.status && resObj.data && resObj.data.token) {
                            try { localStorage.setItem('token', resObj.data.token); } catch (e) {}
                            try { localStorage.setItem('current_user_email', resObj.data.user.email || resObj.data.user.phone || 'guest'); } catch (e) {}
                            setMessage('Login successful ✅');
                            // update auth context
                            try { auth.login(resObj.data.token, resObj.data.user); } catch (e) {}
                            setTimeout(() => router.push('/choose'), 800);
                            setLoading(false);
                            return;
                        }

                        // fallback local
                        const user = users.find((u) => (u.email === email || u.phone === phone) && u.password === password);
                        if (user) {
                            setMessage('Login successful (local) ✅');
                            try { localStorage.setItem('current_user_email', user.email || user.phone || 'guest'); } catch (e) {}
                            try { const localTok = 'local-' + Date.now().toString(); localStorage.setItem('token', localTok); auth.login(localTok, { name: user.name, email: user.email, phone: user.phone, role: user.profession }); } catch (e) {}
                            setTimeout(() => router.push('/choose'), 800);
                        } else {
                            setMessage('User not found or incorrect password ❌');
                        }
                        setLoading(false);
                    }).catch(() => {
                        const user = users.find((u) => (u.email === email || u.phone === phone) && u.password === password);
                        if (user) {
                            setMessage('Login successful (local) ✅');
                            try { localStorage.setItem('current_user_email', user.email || user.phone || 'guest'); } catch (e) {}
                            try { const localTok = 'local-' + Date.now().toString(); localStorage.setItem('token', localTok); auth.login(localTok, { name: user.name, email: user.email, phone: user.phone, role: user.profession }); } catch (e) {}
                            setTimeout(() => router.push('/choose'), 800);
                        } else {
                            setMessage('User not found or incorrect password ❌');
                        }
                        setLoading(false);
                    });
            } else {
                // signup
                if (password !== confirmPassword) {
                    setMessage('Passwords do not match ❌');
                    setLoading(false);
                    return;
                }
                // try backend register
                let backendHandled = false;
                fetch('/api/users/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email: email || undefined, phone: phone || undefined, password, role: profession || 'passenger' }) })
                    .then(r => r.json().then(data => ({ status: r.ok, data })).catch(() => ({ status: r.ok, data: null })))
                    .then((resObj: any) => {
                        if (resObj && resObj.status && resObj.data && resObj.data.token) {
                                backendHandled = true;
                                try { localStorage.setItem('token', resObj.data.token); } catch (e) {}
                                try { localStorage.setItem('current_user_email', resObj.data.user.email || resObj.data.user.phone || 'guest'); } catch (e) {}
                                setMessage('Sign Up successful ✅');
                                try { auth.login(resObj.data.token, resObj.data.user); } catch (e) {}
                                setTimeout(() => router.push('/choose'), 800);
                                setLoading(false);
                                return;
                            }
                    }).catch(() => {
                        // ignore
                    }).finally(() => {
                        if (backendHandled) return;
                        // fallback local save
                        if (users.find((u) => u.email === email || u.phone === phone)) {
                            setMessage('Email or phone already registered ❌');
                        } else {
                            const next = [...users, { email, phone, password, name, profession } as any];
                            saveUsers(next);
                            setMessage('Sign Up successful (local) ✅');
                            try { localStorage.setItem('current_user_email', email || phone || 'guest'); } catch (e) {}
                            try { const localTok = 'local-' + Date.now().toString(); localStorage.setItem('token', localTok); auth.login(localTok, { name, email, phone, role: profession || 'passenger' }); } catch (e) {}
                            setTimeout(() => router.push('/choose'), 800);
                        }
                        setLoading(false);
                    });
                // note: signup flow continues in promise callback; we return here to avoid double-running fallback
                return;
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
                            Email (optional)
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phone (optional)
                        </label>
                        <input
                            type="tel"
                            placeholder="Enter your phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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

