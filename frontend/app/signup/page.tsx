"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

function BtnSpinner() {
  return (
    <span className="relative inline-flex w-7 h-7">
      {/* Static outer track */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
      </svg>
      {/* Wavy rotating ring */}
      <svg className="absolute inset-0 w-full h-full wave-rotate" viewBox="0 0 100 100">
        <circle
          className="wave-move"
          cx="50" cy="50" r="42"
          fill="none"
          stroke="white"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="12 8"
          style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.75))" }}
        />
      </svg>
    </span>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  if (!password) return null;

  const colors = ["bg-red-400", "bg-amber-400", "bg-blue-400", "bg-green-500"];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const textColors = ["text-red-500", "text-amber-500", "text-blue-500", "text-green-600"];

  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex gap-1 flex-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : "bg-gray-100"}`} />
        ))}
      </div>
      <span className={`text-xs font-medium ${textColors[score - 1] ?? "text-gray-400"}`}>
        {labels[score - 1] ?? ""}
      </span>
    </div>
  );
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2500);
  };

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">

      <Link href="/" className="mb-10">
        <Image src="/new-logo.png" alt="Jesup" width={140} height={50} className="h-12 w-auto object-contain" priority />
      </Link>

      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tighter">Create account.</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className={inputCls} />
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className={inputCls} />
          </div>

          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className={inputCls} />

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={inputCls + " pr-12"}
              />
              <button type="button" onClick={() => setShowPassword((p) => !p)} tabIndex={-1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            By signing up you agree to our{" "}
            <Link href="/terms" className="text-primary hover:text-primary-hover font-medium">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:text-primary-hover font-medium">Privacy Policy</Link>.
          </p>

          <button type="submit" disabled={loading}
            className="mt-1 w-full py-3.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center min-h-[52px]">
            {loading ? <BtnSpinner /> : "Create account"}
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:text-primary-hover transition-colors">Sign in</Link>
        </p>

      </div>
    </div>
  );
}
