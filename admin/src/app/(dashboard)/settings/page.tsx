"use client";

import { useState } from "react";

function SettingsSection({ title, description, children }: {
  title: string; description: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-400 mt-0.5">{description}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}


function InputField({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
      />
    </div>
  );
}

export default function SettingsPage() {
  // Store info
  const [storeName,    setStoreName]    = useState("Jesup Shop");
  const [storeEmail,   setStoreEmail]   = useState("admin@jesup.com");
  const [storePhone,   setStorePhone]   = useState("(555) 100-2000");
  const [storeAddress, setStoreAddress] = useState("123 Main St, New York, NY 10001");
  const [currency,     setCurrency]     = useState("USD");
  const [timezone,     setTimezone]     = useState("America/New_York");

  // Shipping
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("50");
  const [standardRate,          setStandardRate]          = useState("5.99");
  const [expressRate,           setExpressRate]           = useState("14.99");

  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="max-w-3xl space-y-5">

      {/* Store Info */}
      <SettingsSection title="Store Information" description="Basic details about your store visible to customers.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Store Name"    value={storeName}    onChange={setStoreName}    placeholder="My Store" />
          <InputField label="Contact Email" value={storeEmail}   onChange={setStoreEmail}   type="email" placeholder="admin@store.com" />
          <InputField label="Phone Number"  value={storePhone}   onChange={setStorePhone}   type="tel"   placeholder="+1 (555) 000-0000" />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white cursor-pointer"
            >
              {["USD", "EUR", "GBP", "CAD", "AUD"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <InputField label="Store Address" value={storeAddress} onChange={setStoreAddress} placeholder="123 Main St, City, State ZIP" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white cursor-pointer"
            >
              {[
                "America/New_York", "America/Chicago", "America/Denver",
                "America/Los_Angeles", "America/Anchorage", "Pacific/Honolulu",
              ].map((tz) => (
                <option key={tz} value={tz}>{tz.replace("_", " ")}</option>
              ))}
            </select>
          </div>
        </div>
      </SettingsSection>

      {/* Shipping */}
      <SettingsSection title="Shipping & Delivery" description="Configure shipping rates and free shipping thresholds.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Free Shipping Threshold</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number" min={0} value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Standard Shipping Rate</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number" min={0} step={0.01} value={standardRate}
                onChange={(e) => setStandardRate(e.target.value)}
                className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Express Shipping Rate</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number" min={0} step={0.01} value={expressRate}
                onChange={(e) => setExpressRate(e.target.value)}
                className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <SettingsSection title="Danger Zone" description="Irreversible actions — proceed with caution.">
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
            Clear All Order Data
          </button>
          <button className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
            Reset Store Settings
          </button>
        </div>
      </SettingsSection>

      {/* Save bar */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <button className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          Discard Changes
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            saved
              ? "bg-emerald-500 text-white"
              : "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/30"
          }`}
        >
          {saved ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}
