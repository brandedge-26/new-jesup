"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const OTP_LENGTH = 6;

export default function OtpPage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("reset_email");
    if (stored) setEmail(stored);
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    const val = value.replace(/\D/g, "").slice(-1);
    setError("");
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    if (val && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleResend = () => {
    setDigits(Array(OTP_LENGTH).fill(""));
    setTimer(59);
    setCanResend(false);
    setError("");
    inputRefs.current[0]?.focus();
  };

  const handleVerify = useCallback(() => {
    const code = digits.join("");
    if (code.length < OTP_LENGTH) { setError("Please enter all 6 digits."); return; }
    setVerifying(true);
    setTimeout(() => { setVerifying(false); router.push("/forgot-password/new-password"); }, 1200);
  }, [digits, router]);

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(b.length) + c)
    : "your email";

  const filled = digits.filter(Boolean).length === OTP_LENGTH;

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

        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tighter">Check your email.</h1>
        <p className="text-sm text-gray-500 mb-8">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-gray-700">{maskedEmail}</span>
        </p>

        {/* OTP boxes */}
        <div className="flex gap-2.5 mb-2">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className={`w-full h-14 text-center text-xl font-bold rounded-xl border-2 transition-all focus:outline-none ${error
                ? "border-red-300 bg-red-50 text-red-600"
                : digit
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 bg-gray-50 text-gray-800 focus:border-primary focus:bg-white"
                }`}
            />
          ))}
        </div>

        {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

        {/* Resend */}
        <div className="flex justify-end mb-6">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-xs text-primary font-semibold hover:text-primary-hover transition-colors"
            >
              Resend code
            </button>
          ) : (
            <p className="text-xs text-gray-400">
              Resend in{" "}
              <span className="font-semibold text-gray-600">
                0:{timer.toString().padStart(2, "0")}
              </span>
            </p>
          )}
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={!filled || verifying}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-colors ${filled && !verifying
            ? "bg-primary text-white hover:bg-primary-hover"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          {verifying ? "Verifying…" : "Verify code"}
        </button>

        {/* Footer links */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
            Wrong email address?
          </Link>
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
