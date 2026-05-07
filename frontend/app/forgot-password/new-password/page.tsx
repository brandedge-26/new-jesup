"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

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
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score - 1] : "bg-gray-100"
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${textColors[score - 1] ?? "text-gray-400"}`}>
        {labels[score - 1] ?? ""}
      </span>
    </div>
  );
}

export default function NewPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setSubmitted(true);
    setTimeout(() => router.push("/login"), 1200);
  };

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <Link href="/" className="mb-10">
        <Image
          src="/new-logo.png"
          alt="Jesup"
          width={140}
          height={50}
          className="h-12 w-auto object-contain"
          priority
        />
      </Link>

      {/* Form container */}
      <div className="w-full max-w-md">

        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tighter">
          Set new password.
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Your new password must be at least 8 characters.
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          {/* New password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="New password"
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          {/* Confirm password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError(""); }}
              placeholder="Confirm password"
              className={`${inputCls} ${
                error === "Passwords do not match."
                  ? "border-red-300 bg-red-50 focus:ring-red-300"
                  : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              tabIndex={-1}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Error */}
          {error && <p className="text-xs text-red-500 -mt-1">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitted}
            className={`mt-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-colors ${
              submitted
                ? "bg-green-500 text-white cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-hover"
            }`}
          >
            {submitted ? "Password updated!" : "Update password"}
          </button>

        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to sign in
          </Link>
        </div>

      </div>
    </div>
  );
}
