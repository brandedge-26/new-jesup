"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MonitorOff, BatteryLow, Zap, Droplets, CameraOff,
  VolumeX, MicOff, PowerOff, Gauge, Box, Thermometer, HelpCircle,
  ChevronLeft, Camera, ScanFace,
} from "lucide-react";
import { useAppointment } from "../_context/AppointmentContext";
import ProgressBar from "../_components/ProgressBar";
import {
  getPricing,
  damageToServices,
  serviceLabelsIphone,
  serviceLabelsSamsung,
  samsungComboServices,
  type ServiceKey,
} from "@/lib/repairPricing";

// ── Brand-specific service options ────────────────────────────────────────────

const iphoneServices = [
  { label: "Screen (LCD)",   icon: MonitorOff },
  { label: "Battery",        icon: BatteryLow },
  { label: "Charging Port",  icon: Zap        },
  { label: "Front Camera",   icon: ScanFace   },
  { label: "Back Camera",    icon: Camera     },
  { label: "Back Housing",   icon: Box        },
];

const samsungServices = [
  { label: "Screen Repair",   icon: MonitorOff },
  { label: "Battery",         icon: BatteryLow },
  { label: "Charging Port",   icon: Zap        },
  { label: "Front Camera",    icon: ScanFace   },
  { label: "Back Camera",     icon: Camera     },
  { label: "Back Glass Only", icon: Box        },
];

const genericOptions = [
  { label: "Cracked / Broken Screen",        icon: MonitorOff  },
  { label: "Battery Not Lasting",            icon: BatteryLow  },
  { label: "Charging Port Issue",            icon: Zap         },
  { label: "Water / Liquid Damage",          icon: Droplets    },
  { label: "Camera Not Working",             icon: CameraOff   },
  { label: "Speaker Not Working",            icon: VolumeX     },
  { label: "Microphone Issue",               icon: MicOff      },
  { label: "Won't Turn On",                  icon: PowerOff    },
  { label: "Slow Performance / Software",    icon: Gauge       },
  { label: "Back Cover / Housing Damage",    icon: Box         },
  { label: "Overheating",                    icon: Thermometer },
  { label: "I Don't Know / Other",           icon: HelpCircle  },
];

export default function DamageTypePage() {
  const router = useRouter();
  const { state, update } = useAppointment();
  const [selected, setSelected] = useState<string[]>(state.damageTypes || []);
  const [description, setDescription] = useState(state.damageDescription || "");

  const toggle = (label: string) =>
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((o) => o !== label) : [...prev, label]
    );

  const handleContinue = () => {
    update({ damageTypes: selected, damageDescription: description });
    router.push("/appointments/delivery-selection");
  };

  const isIphone  = state.brand === "Apple (iPhone)";
  const isSamsung = state.brand === "Samsung";
  const options   = isIphone ? iphoneServices : isSamsung ? samsungServices : genericOptions;
  const isPricedBrand = isIphone || isSamsung;

  // ── Mobile pricing logic ───────────────────────────────────────────────────
  const showPricing = isPricedBrand && !!state.model;
  const pricing = showPricing ? getPricing(state.brand, state.model) : null;
  const serviceLabels = isSamsung ? serviceLabelsSamsung : serviceLabelsIphone;

  const relevantServices: ServiceKey[] = [];
  for (const dmg of selected) {
    const keys = damageToServices[dmg] ?? [];
    for (const key of keys) {
      if (!relevantServices.includes(key)) relevantServices.push(key);
    }
  }

  const pricedServices = pricing
    ? relevantServices.filter((key) => pricing[key] !== null)
    : [];

  const total =
    pricedServices.length > 1 && pricing
      ? pricedServices.reduce((sum, key) => {
          const p = pricing[key];
          return sum + (p ? parseFloat(p.replace("$", "")) : 0);
        }, 0)
      : null;

  return (
    <div className="px-8 lg:px-14 py-10 max-w-2xl">
      <ProgressBar />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">What needs fixing?</h1>
        <p className="mt-1 text-sm text-gray-500">
          {isPricedBrand
            ? "Select the service(s) you need — pricing shows instantly."
            : "Select all issues that apply — we'll handle the rest."}
        </p>
      </div>

      {/* Samsung back-glass note */}
      {isSamsung && (
        <div className="mb-5 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-700">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Samsung pricing:</strong> Screen, Battery, Port, and Camera repairs include back glass replacement at no extra cost.
          </span>
        </div>
      )}

      {/* Issue / service grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {options.map(({ label, icon: Icon }) => {
          const isSelected = selected.includes(label);
          return (
            <button
              key={label}
              onClick={() => toggle(label)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-100 focus:outline-none ${
                isSelected
                  ? "border-gray-900 bg-gray-900/[0.04]"
                  : "border-gray-100 bg-white hover:border-gray-300"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                isSelected ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className={`text-sm font-medium leading-snug flex-1 ${
                isSelected ? "text-gray-900" : "text-gray-600"
              }`}>
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

      {/* ── Mobile pricing card (hidden on lg+, shown on mobile) ── */}
      {showPricing && (
        <div className="lg:hidden mb-6 rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Repair Estimate</p>
          </div>
          <div className="p-4">
            {!pricing ? (
              <p className="text-xs text-gray-400 text-center py-2">
                Pricing not available for this model. We&apos;ll provide a quote after diagnosis.
              </p>
            ) : relevantServices.length === 0 ? (
              <p className="text-xs text-primary/70 text-center py-2">
                Select a service above to see pricing.
              </p>
            ) : (
              <>
                <div className="rounded-xl border border-gray-100 overflow-hidden mb-3">
                  {relevantServices.map((key, i) => {
                    const price = pricing[key];
                    const isCombo = isSamsung && samsungComboServices.includes(key);
                    return (
                      <div
                        key={key}
                        className={`flex items-center justify-between px-4 py-2.5 gap-2 ${
                          i < relevantServices.length - 1 ? "border-b border-gray-100" : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-700 leading-snug">
                            {serviceLabels[key]}
                          </p>
                          {isCombo && (
                            <p className="text-[10px] text-gray-400 leading-none mt-0.5">incl. back glass</p>
                          )}
                        </div>
                        {price ? (
                          <span className="text-sm font-bold text-gray-900 shrink-0">{price}</span>
                        ) : (
                          <span className="text-xs text-gray-300 shrink-0">N/A</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {pricedServices.length === 1 && pricing && (
                  <div className="rounded-xl bg-primary/5 border border-primary/10 px-4 py-3 flex items-center justify-between">
                    <p className="text-xs text-gray-500">Estimated price</p>
                    <p className="text-xl font-bold text-primary">{pricing[pricedServices[0]]}</p>
                  </div>
                )}

                {total !== null && pricedServices.length > 1 && (
                  <div className="rounded-xl bg-primary/5 border border-primary/10 px-4 py-3 flex items-center justify-between">
                    <p className="text-xs text-gray-500">Est. Total ({pricedServices.length} services)</p>
                    <p className="text-xl font-bold text-primary">${total.toFixed(2)}</p>
                  </div>
                )}

                {isSamsung && relevantServices.some((k) => samsungComboServices.includes(k)) && (
                  <p className="mt-2 text-[10px] text-gray-400 leading-relaxed">
                    * Samsung prices include back glass replacement at no extra cost.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Description textarea — for all brands */}
      <div className="mb-8">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          {isPricedBrand ? (
            <>Any other issue not listed above? <span className="normal-case font-normal">(optional)</span></>
          ) : (
            <>Additional details <span className="normal-case font-normal">(optional)</span></>
          )}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={
            isPricedBrand
              ? "Describe any other problem with your device — we'll review it and contact you."
              : "Describe the issue in more detail..."
          }
          rows={3}
          className="w-full rounded-xl border-2 border-gray-100 bg-white px-4 py-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none transition"
        />
        {isPricedBrand && (
          <p className="mt-1.5 text-xs text-gray-400">
            If you have any issue not listed above, describe it here and we&apos;ll contact you with a quote.
          </p>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-6">
        <Link
          href="/appointments/device-type"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
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
