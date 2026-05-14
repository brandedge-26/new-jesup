"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import {
  iphoneModels,
  samsungSSeriesModels,
  samsungNoteSeriesModels,
  iphoneServiceLabels,
  samsungServiceLabels,
  samsungIncludesBackGlass,
  type PhoneModel,
  type ServiceKey,
} from "@/data/repairPricing";

// ─── Icons ───────────────────────────────────────────────────────────────────

const ServiceIcons: Record<ServiceKey, React.ReactNode> = {
  lcd: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4" />
    </svg>
  ),
  battery: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2zM22 11v2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 12h4" />
    </svg>
  ),
  chargingPort: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  frontCamera: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  backCamera: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  backHousing: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
};

// ─── Brand Card ──────────────────────────────────────────────────────────────

function BrandCard({
  brand,
  selected,
  onClick,
}: {
  brand: "iphone" | "samsung";
  selected: boolean;
  onClick: () => void;
}) {
  const isIphone = brand === "iphone";
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-8 transition-all cursor-pointer
        ${selected ? "border-primary bg-primary/5 shadow-md" : "border-gray-200 bg-white hover:border-primary/40 hover:shadow-sm"}`}
    >
      {/* Apple / Samsung logo placeholder */}
      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors
        ${selected ? "bg-primary text-white" : "bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary"}`}>
        {isIphone ? (
          <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
        ) : (
          <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
        )}
      </div>
      <div className="text-center">
        <p className={`text-base font-semibold transition-colors ${selected ? "text-primary" : "text-gray-900"}`}>
          {isIphone ? "Apple iPhone" : "Samsung Galaxy"}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {isIphone ? "iPhone 6 – 17 Series" : "S / Note Series"}
        </p>
      </div>
      {selected && (
        <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  );
}

// ─── Model Button ─────────────────────────────────────────────────────────────

function ModelButton({ model, selected, onClick }: { model: PhoneModel; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium text-left transition-all cursor-pointer
        ${selected
          ? "border-primary bg-primary/5 text-primary shadow-sm"
          : "border-gray-200 bg-white text-gray-700 hover:border-primary/40 hover:text-gray-900"
        }`}
    >
      {model.name}
    </button>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({
  serviceKey,
  label,
  price,
  includesBackGlass,
  selected,
  onClick,
}: {
  serviceKey: ServiceKey;
  label: string;
  price: string | null;
  includesBackGlass: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  const available = price !== null;
  return (
    <button
      onClick={available ? onClick : undefined}
      disabled={!available}
      className={`relative flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all
        ${!available ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-50" : "cursor-pointer"}
        ${available && selected ? "border-primary bg-primary/5 shadow-md" : ""}
        ${available && !selected ? "border-gray-200 bg-white hover:border-primary/40 hover:shadow-sm" : ""}`}
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors
        ${selected ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}>
        {ServiceIcons[serviceKey]}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm leading-tight ${selected ? "text-primary" : "text-gray-900"}`}>{label}</p>
        {includesBackGlass && available && (
          <p className="text-[11px] text-gray-400 mt-0.5">Includes back glass</p>
        )}
      </div>
      <div className="text-right shrink-0">
        {available ? (
          <span className={`text-lg font-bold ${selected ? "text-primary" : "text-gray-900"}`}>{price}</span>
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        )}
      </div>
      {selected && (
        <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  );
}

// ─── Step Header ─────────────────────────────────────────────────────────────

function StepHeader({ num, title, done, locked }: { num: number; title: string; done: boolean; locked: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${locked ? "opacity-40" : ""}`}>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors
        ${done ? "bg-primary text-white" : locked ? "bg-gray-200 text-gray-500" : "bg-primary/10 text-primary"}`}>
        {done ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : num}
      </span>
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
    </div>
  );
}

// ─── Price Panel ─────────────────────────────────────────────────────────────

function PricePanel({
  brand,
  model,
  serviceKey,
  serviceLabelIphone,
  serviceLabelSamsung,
  price,
  includesBackGlass,
}: {
  brand: "iphone" | "samsung" | null;
  model: PhoneModel | null;
  serviceKey: ServiceKey | null;
  serviceLabelIphone: string;
  serviceLabelSamsung: string;
  price: string | null;
  includesBackGlass: boolean;
}) {
  const serviceLabel = brand === "iphone" ? serviceLabelIphone : serviceLabelSamsung;
  const isComplete = brand && model && serviceKey && price;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Panel header */}
      <div className="bg-gradient-to-br from-primary to-[#6b1cb0] px-6 py-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Your Repair Quote</p>
        <p className="mt-1 text-2xl font-bold">
          {isComplete ? price : "—"}
        </p>
        {isComplete && price && (
          <p className="mt-1 text-sm text-white/80">Estimated repair cost</p>
        )}
      </div>

      <div className="px-6 py-5 space-y-4">
        {/* Selection summary */}
        <div className="space-y-3">
          {/* Brand */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Brand</span>
            <span className="font-medium text-gray-900">
              {brand ? (brand === "iphone" ? "Apple iPhone" : "Samsung Galaxy") : <span className="text-gray-300">Not selected</span>}
            </span>
          </div>
          <div className="h-px bg-gray-100" />
          {/* Model */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Model</span>
            <span className="font-medium text-gray-900 text-right max-w-[160px] truncate">
              {model ? model.name : <span className="text-gray-300">Not selected</span>}
            </span>
          </div>
          <div className="h-px bg-gray-100" />
          {/* Service */}
          <div className="flex items-start justify-between text-sm gap-2">
            <span className="text-gray-500 shrink-0">Service</span>
            <div className="text-right">
              <span className="font-medium text-gray-900">
                {serviceKey ? serviceLabel : <span className="text-gray-300">Not selected</span>}
              </span>
              {serviceKey && includesBackGlass && brand === "samsung" && (
                <p className="text-[11px] text-gray-400">incl. back glass</p>
              )}
            </div>
          </div>
        </div>

        {isComplete ? (
          <>
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-3 text-center">
              <p className="text-2xl font-bold text-primary">{price}</p>
              <p className="text-xs text-gray-500 mt-0.5">All-in repair price</p>
            </div>
            <Link
              href="#"
              className="flex items-center justify-center w-full rounded-full bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              Book This Repair
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <p className="text-center text-xs text-gray-400">No upfront payment · Free diagnosis</p>
          </>
        ) : (
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-center">
            <p className="text-sm text-gray-500">
              {!brand
                ? "Select a brand to get started"
                : !model
                ? "Now choose your model"
                : "Pick a service to see the price"}
            </p>
          </div>
        )}
      </div>

      {/* Trust badges */}
      <div className="border-t border-gray-100 px-6 py-4">
        <div className="grid grid-cols-2 gap-2 text-center">
          {[
            { icon: "🔧", text: "Expert Techs" },
            { icon: "✅", text: "90-Day Warranty" },
            { icon: "⚡", text: "Same-Day Repair" },
            { icon: "💳", text: "No Hidden Fees" },
          ].map((b) => (
            <div key={b.text} className="flex flex-col items-center gap-1">
              <span className="text-lg">{b.icon}</span>
              <span className="text-[10px] font-medium text-gray-500">{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StartRepairPage() {
  const [brand, setBrand] = useState<"iphone" | "samsung" | null>(null);
  const [model, setModel] = useState<PhoneModel | null>(null);
  const [serviceKey, setServiceKey] = useState<ServiceKey | null>(null);

  function handleBrandSelect(b: "iphone" | "samsung") {
    if (b !== brand) {
      setBrand(b);
      setModel(null);
      setServiceKey(null);
    }
  }

  function handleModelSelect(m: PhoneModel) {
    if (m.id !== model?.id) {
      setModel(m);
      setServiceKey(null);
    }
  }

  const serviceLabels = brand === "samsung" ? samsungServiceLabels : iphoneServiceLabels;
  const currentPrice = model && serviceKey ? model.pricing[serviceKey] : null;
  const includesBackGlass = serviceKey ? samsungIncludesBackGlass.includes(serviceKey) : false;

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Page hero */}
        <div className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-8">
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-600 font-medium">Start a Repair</span>
            </nav>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Get an Instant Repair Quote</h1>
            <p className="mt-2 text-gray-500 text-sm lg:text-base max-w-xl">
              Select your device and the service you need — we&apos;ll show you exact pricing right away.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── Left: Wizard ── */}
            <div className="flex-1 min-w-0 space-y-8">

              {/* Step 1 — Brand */}
              <section className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
                <StepHeader num={1} title="Choose your brand" done={!!brand} locked={false} />
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <BrandCard brand="iphone" selected={brand === "iphone"} onClick={() => handleBrandSelect("iphone")} />
                  <BrandCard brand="samsung" selected={brand === "samsung"} onClick={() => handleBrandSelect("samsung")} />
                </div>
              </section>

              {/* Step 2 — Model */}
              <section className={`rounded-2xl bg-white border shadow-sm p-6 transition-opacity ${brand ? "border-gray-200 opacity-100" : "border-gray-100 opacity-50 pointer-events-none"}`}>
                <StepHeader num={2} title="Select your model" done={!!model} locked={!brand} />

                {brand === "iphone" && (
                  <div className="mt-5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {iphoneModels.map((m) => (
                        <ModelButton key={m.id} model={m} selected={model?.id === m.id} onClick={() => handleModelSelect(m)} />
                      ))}
                    </div>
                  </div>
                )}

                {brand === "samsung" && (
                  <div className="mt-5 space-y-6">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">S Series</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {samsungSSeriesModels.map((m) => (
                          <ModelButton key={m.id} model={m} selected={model?.id === m.id} onClick={() => handleModelSelect(m)} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Note Series</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {samsungNoteSeriesModels.map((m) => (
                          <ModelButton key={m.id} model={m} selected={model?.id === m.id} onClick={() => handleModelSelect(m)} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!brand && (
                  <p className="mt-5 text-sm text-gray-400">Select a brand first to see available models.</p>
                )}
              </section>

              {/* Step 3 — Service */}
              <section className={`rounded-2xl bg-white border shadow-sm p-6 transition-opacity ${model ? "border-gray-200 opacity-100" : "border-gray-100 opacity-50 pointer-events-none"}`}>
                <StepHeader num={3} title="What needs fixing?" done={!!serviceKey} locked={!model} />

                {model ? (
                  <div className="mt-5">
                    {brand === "samsung" && (
                      <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-700">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><strong>Samsung pricing:</strong> Screen, Battery, Port, and Camera repairs include a simultaneous back glass replacement at no extra cost.</span>
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-3">
                      {(Object.keys(serviceLabels) as ServiceKey[]).map((key) => (
                        <ServiceCard
                          key={key}
                          serviceKey={key}
                          label={serviceLabels[key]}
                          price={model.pricing[key]}
                          includesBackGlass={brand === "samsung" && samsungIncludesBackGlass.includes(key)}
                          selected={serviceKey === key}
                          onClick={() => setServiceKey(key)}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-gray-400">Select your model first to see available services.</p>
                )}
              </section>
            </div>

            {/* ── Right: Price Panel (sticky) ── */}
            <div className="w-full lg:w-80 xl:w-96 lg:sticky lg:top-6 shrink-0">
              <PricePanel
                brand={brand}
                model={model}
                serviceKey={serviceKey}
                serviceLabelIphone={serviceKey ? iphoneServiceLabels[serviceKey] : ""}
                serviceLabelSamsung={serviceKey ? samsungServiceLabels[serviceKey] : ""}
                price={currentPrice}
                includesBackGlass={includesBackGlass}
              />
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
