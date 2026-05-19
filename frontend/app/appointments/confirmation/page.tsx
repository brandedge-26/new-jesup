"use client";

import Link from "next/link";
import { CheckCircle2, CalendarDays, Clock } from "lucide-react";
import { useAppointment } from "../_context/AppointmentContext";
import {
  getPricing,
  damageToServices,
  serviceLabelsIphone,
  serviceLabelsSamsung,
  samsungComboServices,
  type ServiceKey,
} from "@/lib/repairPricing";

export default function ConfirmationPage() {
  const { state, reset } = useAppointment();
  const deviceSummary = [state.brand, state.model].filter(Boolean).join(" ") || "Your device";
  const services = state.damageTypes.length > 0 ? state.damageTypes.join(", ") : "—";

  // ── Pricing ───────────────────────────────────────────────────────────────
  const isIphone  = state.brand === "Apple (iPhone)";
  const isSamsung = state.brand === "Samsung";
  const isPricedBrand = isIphone || isSamsung;
  const pricing = isPricedBrand && state.model ? getPricing(state.brand, state.model) : null;
  const serviceLabels = isSamsung ? serviceLabelsSamsung : serviceLabelsIphone;

  const relevantServices: ServiceKey[] = [];
  for (const dmg of state.damageTypes) {
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

      {/* Success hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border-4 border-green-100 mb-5">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h1>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          We&apos;ll see you with your{" "}
          <span className="font-semibold text-gray-700">{deviceSummary}</span>.
          A confirmation has been sent to your email.
        </p>
      </div>

      {/* Appointment slot card */}
      {(state.appointmentDate || state.appointmentTime) && (
        <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 overflow-hidden mb-6">
          <div className="px-5 py-3 bg-primary/10 border-b border-primary/10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest">Your Appointment</p>
          </div>
          <div className="p-5 flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-primary/20 flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Date</p>
                <p className="text-sm font-bold text-gray-900">{state.appointmentDate || "—"}</p>
              </div>
            </div>
            <div className="w-px h-8 bg-primary/10" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-primary/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Time</p>
                <p className="text-sm font-bold text-gray-900">{state.appointmentTime || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Repair summary card */}
      <div className="rounded-2xl border-2 border-gray-100 bg-white overflow-hidden mb-6">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Repair Summary</p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {[
            { label: "Device",   value: deviceSummary },
            { label: "Services", value: services },
            { label: "Contact",  value: state.firstName ? `${state.firstName} ${state.lastName}` : "—" },
            { label: "Email",    value: state.email || "—" },
            { label: "Phone",    value: state.phone || "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-gray-800 leading-snug">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Repair Estimate card — iPhone & Samsung only */}
      {isPricedBrand && (
        <div className="rounded-2xl border-2 border-gray-100 bg-white overflow-hidden mb-6">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Repair Estimate</p>
          </div>
          <div className="p-5">
            {!pricing ? (
              <p className="text-sm text-gray-400 text-center py-2">
                Pricing not available for this model. We&apos;ll provide a quote after diagnosis.
              </p>
            ) : pricedServices.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-2">
                We&apos;ll provide a quote after diagnosis.
              </p>
            ) : (
              <>
                <div className="rounded-xl border border-gray-100 overflow-hidden mb-4">
                  {pricedServices.map((key, i) => {
                    const price = pricing[key];
                    const isCombo = isSamsung && samsungComboServices.includes(key);
                    return (
                      <div
                        key={key}
                        className={`flex items-center justify-between px-4 py-3 gap-2 ${
                          i < pricedServices.length - 1 ? "border-b border-gray-100" : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-700">{serviceLabels[key]}</p>
                          {isCombo && (
                            <p className="text-[11px] text-gray-400 mt-0.5">incl. back glass replacement</p>
                          )}
                        </div>
                        <span className="text-sm font-bold text-gray-900 shrink-0">{price}</span>
                      </div>
                    );
                  })}
                </div>

                {pricedServices.length === 1 && (
                  <div className="rounded-xl bg-primary/5 border border-primary/10 px-5 py-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Estimated price</p>
                    <p className="text-2xl font-bold text-primary">{pricing[pricedServices[0]]}</p>
                  </div>
                )}

                {total !== null && pricedServices.length > 1 && (
                  <div className="rounded-xl bg-primary/5 border border-primary/10 px-5 py-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Est. Total ({pricedServices.length} services)</p>
                    <p className="text-2xl font-bold text-primary">${total.toFixed(2)}</p>
                  </div>
                )}

                {isSamsung && pricedServices.some((k) => samsungComboServices.includes(k)) && (
                  <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                    * Samsung prices include back glass replacement at no extra cost.
                  </p>
                )}

                <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                  This is an estimate. You only pay after we diagnose and you approve the repair.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Book another */}
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
