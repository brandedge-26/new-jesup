"use client";

import Link from "next/link";
import {
  CheckCircle2, Package, Shield, LockKeyhole, Cpu, ArrowRight,
} from "lucide-react";
import { useAppointment } from "../_context/AppointmentContext";

const shippingSteps = [
  "Print your shipping label — valid for 7 days.",
  "Wrap your device in bubble wrap and place in a small box.",
  "Attach the label on the outside of the box.",
  "Drop it off at your nearest courier location.",
];

const beforeYouShip = [
  { Icon: LockKeyhole, text: "Turn off your screen lock / passcode so we can run diagnostics." },
  { Icon: Shield, text: "iPhone: disable Find My. Android: disable Factory Reset Protection." },
  { Icon: Package, text: "Back up your data — we're not responsible for data loss." },
  { Icon: Cpu, text: "Remove SIM card and all accessories before shipping." },
];

export default function ConfirmationPage() {
  const { state, reset } = useAppointment();
  const deviceSummary = [state.brand, state.model].filter(Boolean).join(" ") || "Your device";

  return (
    <div className="px-8 lg:px-14 py-10 max-w-2xl">

      {/* Success hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border-4 border-green-100 mb-5">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re all set!</h1>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Repair request submitted for{" "}
          <span className="font-semibold text-gray-700">{deviceSummary}</span>.
          Check your inbox for the shipping label.
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border-2 border-gray-100 bg-white overflow-hidden mb-6">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Repair Summary</p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {[
            { label: "Device", value: deviceSummary },
            { label: "Method", value: "Mail-In" },
            { label: "Issues", value: state.damageTypes.slice(0, 2).join(", ") || "—" },
            { label: "Contact", value: state.firstName ? `${state.firstName} ${state.lastName}` : "—" },
            { label: "Email", value: state.email || "—" },
            { label: "Phone", value: state.phone || "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-gray-800 leading-snug">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping instructions */}
      <div className="rounded-2xl border-2 border-gray-100 bg-white overflow-hidden mb-6">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shipping Instructions</p>
        </div>
        <ol className="p-5 flex flex-col gap-3">
          {shippingSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-gray-600 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Before you ship */}
      <div className="rounded-2xl bg-amber-50 border-2 border-amber-100 overflow-hidden mb-8">
        <div className="px-5 py-3 border-b border-amber-100">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Before You Ship</p>
        </div>
        <ul className="p-5 flex flex-col gap-3.5">
          {beforeYouShip.map(({ Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <span className="text-xs text-amber-800 leading-relaxed pt-1">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* After we receive */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 px-5 py-4 mb-8 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
          <ArrowRight className="w-3.5 h-3.5 text-gray-700" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-0.5">After we receive it</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            We diagnose, call you with a quote, and only proceed with your approval. Device shipped back within 3–5 business days.
          </p>
        </div>
      </div>

      {/* Action */}
      <Link
        href="/appointments/device-type"
        onClick={reset}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-150"
      >
        Book Another Repair
      </Link>

    </div>
  );
}
