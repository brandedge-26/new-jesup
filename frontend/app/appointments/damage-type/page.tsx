"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MonitorOff, BatteryLow, Zap, Droplets, CameraOff,
  VolumeX, MicOff, PowerOff, Gauge, Box, Thermometer, HelpCircle, ChevronLeft,
} from "lucide-react";
import { useAppointment } from "../_context/AppointmentContext";
import ProgressBar from "../_components/ProgressBar";

const damageOptions = [
  { label: "Cracked / Broken Screen", icon: MonitorOff },
  { label: "Battery Not Lasting", icon: BatteryLow },
  { label: "Charging Port Issue", icon: Zap },
  { label: "Water / Liquid Damage", icon: Droplets },
  { label: "Camera Not Working", icon: CameraOff },
  { label: "Speaker Not Working", icon: VolumeX },
  { label: "Microphone Issue", icon: MicOff },
  { label: "Won't Turn On", icon: PowerOff },
  { label: "Slow Performance / Software", icon: Gauge },
  { label: "Back Cover / Housing Damage", icon: Box },
  { label: "Overheating", icon: Thermometer },
  { label: "I Don't Know / Other", icon: HelpCircle },
];

export default function DamageTypePage() {
  const router = useRouter();
  const { state, update } = useAppointment();
  const [selected, setSelected] = useState<string[]>(state.damageTypes || []);
  const [description, setDescription] = useState(state.damageDescription || "");

  const toggle = (label: string) =>
    setSelected((prev) => prev.includes(label) ? prev.filter((o) => o !== label) : [...prev, label]);

  const handleContinue = () => {
    update({ damageTypes: selected, damageDescription: description });
    router.push("/appointments/delivery-selection");
  };

  return (
    <div className="px-8 lg:px-14 py-10 max-w-2xl">
      <ProgressBar />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">What&apos;s the issue?</h1>
        <p className="mt-1 text-sm text-gray-500">Select all that apply — we&apos;ll handle the rest.</p>
      </div>

      {/* Issue grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {damageOptions.map(({ label, icon: Icon }) => {
          const isSelected = selected.includes(label);
          return (
            <button
              key={label}
              onClick={() => toggle(label)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-100 focus:outline-none ${
                isSelected
                  ? "border-gray-900 bg-gray-900/4"
                  : "border-gray-100 bg-white hover:border-gray-300"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                isSelected ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className={`text-sm font-medium leading-snug flex-1 ${isSelected ? "text-gray-900" : "text-gray-600"}`}>
                {label}
              </span>
              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Description */}
      <div className="mb-8">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          Additional details <span className="normal-case font-normal">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue in more detail..."
          rows={3}
          className="w-full rounded-xl border-2 border-gray-100 bg-white px-4 py-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none transition"
        />
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-5 border-t border-gray-100">
        <Link href="/appointments/device-type" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        <button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-150 ${
            selected.length > 0
              ? "bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md hover:-translate-y-px"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
