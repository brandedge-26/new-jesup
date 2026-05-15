"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

function BtnSpinner() {
  return (
    <span className="relative inline-flex w-6 h-6">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
      </svg>
      <svg className="absolute inset-0 w-full h-full animate-spin" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="8"
          strokeLinecap="round" strokeDasharray="60 200" />
      </svg>
    </span>
  );
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const login  = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    // Simulate auth — replace with real API call
    setTimeout(() => {
      const [firstName, ...rest] = email.split("@")[0].split(".");
      login({ firstName: firstName ?? "User", lastName: rest[0] ?? "", email });
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">

      {/* Logo */}
      <Link href="/" className="mb-10">
        <Image src="/new-logo.png" alt="Jesup" width={140} height={50}
          className="h-12 w-auto object-contain" priority />
      </Link>

      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome back.</h1>
        <p className="text-sm text-gray-400 mb-8">Sign in to your Jesup Shop account.</p>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition"
            />
            <button type="button" onClick={() => setShowPassword((p) => !p)} tabIndex={-1}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link href="/forgot-password"
              className="text-primary hover:text-primary-hover font-medium transition-colors">
              Forgot password?
            </Link>
            <Link href="/signup" className="text-gray-400 hover:text-gray-700 transition-colors">
              No account?{" "}
              <span className="text-primary font-semibold">Sign up</span>
            </Link>
          </div>

          <button type="submit" disabled={loading}
            className="mt-1 w-full py-3.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center min-h-[52px] disabled:opacity-70">
            {loading ? <BtnSpinner /> : "Sign in"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

        </form>
      </div>
    </div>
  );
}
