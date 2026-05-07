"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAppointment, deviceLabels } from "../_context/AppointmentContext";
import { Check, Package } from "lucide-react";

const deviceImages: Record<string, string> = {
  phone: "/header-images/phone-repair/iphone.png",
  tablet: "/header-images/tech-repair/ipad.png",
  computer: "/header-images/tech-repair/computer.png",
  "game-console": "/header-images/tech-repair/game-console.png",
};

const stepPaths = [
  "/appointments/device-type",
  "/appointments/damage-type",
  "/appointments/delivery-selection",
  "/appointments/customer-details",
  "/appointments/confirmation",
];

const benefits = [
  "90-day repair warranty",
  "Fast turnaround time",
  "Free diagnostics",
  "Secure mail-in shipping",
];

export default function Sidebar() {
  const { state } = useAppointment();
  const pathname = usePathname();
  const currentStep = stepPaths.findIndex((p) => pathname.startsWith(p));

  const deviceImage = state.deviceType ? deviceImages[state.deviceType] : null;
  const deviceLabel = state.deviceType ? deviceLabels[state.deviceType] : null;
  const device = [state.brand, state.model].filter(Boolean).join(" ") || deviceLabel;
  const issues = state.damageTypes.length > 0
    ? state.damageTypes.slice(0, 2).join(", ") + (state.damageTypes.length > 2 ? ` +${state.damageTypes.length - 2}` : "")
    : null;
  const contact = state.firstName ? `${state.firstName} ${state.lastName}` : null;

  return (
    <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 border-l border-gray-100 bg-white">
      <div className="sticky top-16 p-6 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-4rem)]">

        {/* Device preview */}
        <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
            {deviceImage ? (
              <div className="relative w-9 h-9">
                <Image src={deviceImage} alt="device" fill className="object-contain" />
              </div>
            ) : (
              <Package className="w-5 h-5 text-gray-300" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              {state.deviceType ? deviceLabels[state.deviceType] : "Your device"}
            </p>
            <p className="text-sm font-bold text-gray-900 leading-snug truncate">
              {state.model || state.brand || "Select a device"}
            </p>
            {issues && <p className="text-xs text-gray-500 mt-0.5 truncate">{issues}</p>}
          </div>
        </div>

        {/* Order details */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Order details</p>
          <div className="flex flex-col gap-1">
            <DetailRow label="Device" value={device} done={currentStep > 0} />
            <DetailRow label="Issues" value={issues} done={currentStep > 1} />
            <DetailRow label="Shipping" value={currentStep >= 2 ? "Mail-In" : null} done={currentStep > 2} />
            <DetailRow label="Contact" value={contact} done={currentStep > 3} />
            <DetailRow label="Email" value={state.email || null} />
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Why Jesup */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Why Jesup</p>
          <ul className="flex flex-col gap-2.5">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-sm text-gray-600">
                <div className="w-4 h-4 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* No payment */}
        <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
          <p className="text-xs text-amber-700 leading-relaxed">
            <span className="font-semibold">No payment now.</span> You only pay after we diagnose and you approve.
          </p>
        </div>

      </div>
    </aside>
  );
}

function DetailRow({ label, value, done }: { label: string; value?: string | null; done?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-gray-50 last:border-0">
      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
        done ? "border-gray-900 bg-gray-900" : "border-gray-200 bg-white"
      }`}>
        {done && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
      </div>
      <span className="text-xs text-gray-400 w-14 shrink-0">{label}</span>
      <span className={`text-xs font-medium truncate ${value ? "text-gray-700" : "text-gray-300 italic"}`}>
        {value ?? "—"}
      </span>
    </div>
  );
}
