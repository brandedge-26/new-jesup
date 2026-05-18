"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useAppointment } from "../_context/AppointmentContext";
import ProgressBar from "../_components/ProgressBar";
import { publicAxios } from "@/lib/axios";

interface Errors { firstName?: string; lastName?: string; email?: string; phone?: string; }

export default function CustomerDetailsPage() {
  const router = useRouter();
  const { state, update } = useAppointment();

  const [firstName, setFirstName] = useState(state.firstName || "");
  const [lastName, setLastName] = useState(state.lastName || "");
  const [email, setEmail] = useState(state.email || "");
  const [phone, setPhone] = useState(state.phone || "");
  const [marketingOptIn, setMarketingOptIn] = useState(state.marketingOptIn ?? false);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = (): Errors => {
    const e: Errors = {};
    if (!firstName.trim()) e.firstName = "Required";
    if (!lastName.trim()) e.lastName = "Required";
    if (!email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!phone.trim()) e.phone = "Required";
    return e;
  };

  const handleSubmit = async () => {
    setTouched(true);
    setApiError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // UPDATE CONTEXT
    update({ firstName, lastName, email, phone, marketingOptIn });

    setLoading(true);
    try {
      await publicAxios.post("/appointments", {
        deviceType: state.deviceType,
        brand: state.brand,
        model: state.model,
        damageTypes: state.damageTypes,
        damageDescription: state.damageDescription,
        appointmentDate: state.appointmentDate,
        appointmentTime: state.appointmentTime,
        zipCode: state.zipCode,
        streetAddress: state.streetAddress,
        location: state.location,
        firstName,
        lastName,
        email,
        phone,
        marketingOptIn,
      });

      router.push("/appointments/confirmation");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setApiError(msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (err?: string) =>
    `w-full rounded-xl border-2 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-0 bg-white ${
      err ? "border-red-300 focus:border-red-400" : "border-gray-100 focus:border-gray-900"
    }`;

  const clear = (f: keyof Errors) => { if (touched) setErrors((p) => ({ ...p, [f]: undefined })); };

  return (
    <div className="px-8 lg:px-14 py-10 max-w-2xl">
      <ProgressBar />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your contact details</h1>
        <p className="mt-1 text-sm text-gray-500">We&apos;ll send your appointment confirmation here.</p>
      </div>

      {apiError && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          {apiError}
        </div>
      )}

      <div className="flex flex-col gap-5 mb-6">

        {/* Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">First Name</label>
            <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); clear("firstName"); }}
              placeholder="Ali" className={inputCls(errors.firstName)} />
            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Last Name</label>
            <input type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); clear("lastName"); }}
              placeholder="Khan" className={inputCls(errors.lastName)} />
            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email Address</label>
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); clear("email"); }}
            placeholder="ali@example.com" className={inputCls(errors.email)} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone Number</label>
          <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); clear("phone"); }}
            placeholder="+1 (555) 000-0000" className={inputCls(errors.phone)} />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          {!errors.phone && <p className="mt-1 text-xs text-gray-400">We&apos;ll call you with your repair quote.</p>}
        </div>

        {/* Marketing opt-in */}
        <button type="button" onClick={() => setMarketingOptIn((p) => !p)} className="flex items-start gap-3 text-left">
          <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
            marketingOptIn ? "border-gray-900 bg-gray-900" : "border-gray-200 bg-white"
          }`}>
            {marketingOptIn && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-sm text-gray-500">Send me repair tips and exclusive offers via email.</span>
        </button>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed mb-8">
        By continuing you agree to our{" "}
        <Link href="/terms" className="text-gray-700 hover:text-gray-900 underline underline-offset-2">Terms of Service</Link>
        {" "}and{" "}
        <Link href="/privacy" className="text-gray-700 hover:text-gray-900 underline underline-offset-2">Privacy Policy</Link>.
      </p>

      {/* Nav */}
      <div className="flex items-center justify-between pt-5 border-t border-gray-100">
        <Link href="/appointments/delivery-selection" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-2.5 rounded-full text-sm font-bold bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Request →"
          )}
        </button>
      </div>
    </div>
  );
}
