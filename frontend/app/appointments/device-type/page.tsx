"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, ChevronLeft } from "lucide-react";
import {
  useAppointment, DeviceType, brandsByDevice, modelsByBrand,
} from "../_context/AppointmentContext";
import ProgressBar from "../_components/ProgressBar";
import Link from "next/link";

const devices: { type: DeviceType; label: string; image: string }[] = [
  { type: "phone", label: "Phone", image: "/header-images/phone-repair/iphone.png" },
  { type: "tablet", label: "Tablet", image: "/header-images/tech-repair/ipad.png" },
  { type: "computer", label: "Computer", image: "/header-images/tech-repair/computer.png" },
  { type: "game-console", label: "Game Console", image: "/header-images/tech-repair/game-console.png" },
];

export default function DeviceTypePage() {
  const router = useRouter();
  const { update, reset } = useAppointment();

  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  useEffect(() => { reset(); }, []);

  const brands = selectedDevice ? brandsByDevice[selectedDevice] ?? [] : [];
  const models = selectedBrand ? modelsByBrand[selectedBrand] ?? [] : [];
  const canContinue = !!selectedDevice && !!selectedBrand && !!selectedModel;

  useEffect(() => { setSelectedBrand(""); setSelectedModel(""); }, [selectedDevice]);
  useEffect(() => { setSelectedModel(""); }, [selectedBrand]);

  const handleContinue = () => {
    update({ deviceType: selectedDevice, brand: selectedBrand, model: selectedModel });
    router.push("/appointments/damage-type");
  };

  return (
    <div className="px-8 lg:px-14 py-10 max-w-2xl">
      <ProgressBar />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">What device needs repair?</h1>
        <p className="mt-1 text-sm text-gray-500">Select your device type to get started.</p>
      </div>

      {/* Device cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {devices.map(({ type, label, image }) => {
          const isSelected = selectedDevice === type;
          return (
            <button
              key={type}
              onClick={() => setSelectedDevice(type)}
              className={`group flex flex-col items-center gap-3 py-6 px-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer focus:outline-none ${
                isSelected
                  ? "border-gray-900 bg-gray-900/4 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm"
              }`}
            >
              <div className={`relative w-16 h-14 transition-transform duration-200 ${isSelected ? "scale-110" : "group-hover:scale-105"}`}>
                <Image src={image} alt={label} fill className="object-contain" />
              </div>
              <span className={`text-xs font-bold tracking-wide transition-colors ${isSelected ? "text-gray-900" : "text-gray-400"}`}>
                {label.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Brand pills */}
      {selectedDevice && (
        <div className="mb-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Select brand</p>
          <div className="flex flex-wrap gap-2">
            {brands.map((b) => {
              const isSelected = selectedBrand === b;
              return (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-150 ${
                    isSelected
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Model dropdown */}
      {selectedBrand && models.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Select model</p>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={`w-full appearance-none rounded-xl border-2 px-4 py-3.5 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white transition-all ${
                selectedModel ? "border-gray-900 text-gray-900" : "border-gray-200 text-gray-400"
              }`}
            >
              <option value="">Choose your model</option>
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-4">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-150 ${
            canContinue
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
