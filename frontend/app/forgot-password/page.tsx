"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    sessionStorage.setItem("reset_email", email);
    setTimeout(() => router.push("/forgot-password/otp"), 600);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <Link href="/" className="mb-10">
        <Image
          src="/jesup-logo.svg"
          alt="Jesup"
          width={140}
          height={50}
          className="h-12 w-auto object-contain"
          priority
        />
      </Link>

      {/* Form container */}
      <div className="w-full max-w-md">

        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tighter">Reset password.</h1>
        <p className="text-sm text-gray-500 mb-8">
          Enter your email — we&apos;ll send you a verification code.
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition"
          />

          <button
            type="submit"
            disabled={submitted}
            className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-colors ${submitted
              ? "bg-primary/60 text-white cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-hover"
              }`}
          >
            {submitted ? "Sending…" : "Send verification code"}
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
