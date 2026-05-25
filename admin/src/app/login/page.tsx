"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAdminAuthStore } from "@/store/adminAuthStore";

export default function AdminLoginPage() {
    const router = useRouter();
    const login = useAdminAuthStore((s) => s.login);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;

        setError("");
        setLoading(true);
        try {
            await login(email, password);
            router.push("/dashboard");
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(msg || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-10">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/jesup-admin-logo.svg" alt="Jesup" className="h-10 object-contain" />
                    </div>

                    <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Admin Login</h1>
                    <p className="text-sm text-gray-400 text-center mb-8">Sign in to access the dashboard</p>

                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@jesup.com"
                                required
                                className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors shadow-sm shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in…
                                </>
                            ) : "Sign In"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Jesup Wireless Admin Panel — restricted access only
                </p>
            </div>
        </div>
    );
}
