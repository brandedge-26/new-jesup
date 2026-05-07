"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Loader2 } from "lucide-react";
import { useAppointment } from "../_context/AppointmentContext";
import ProgressBar from "../_components/ProgressBar";

type GeoStatus = "idle" | "loading" | "success" | "error";

export default function DeliverySelectionPage() {
  const router = useRouter();
  const { update } = useAppointment();

  const [streetAddress, setStreetAddress] = useState("");
  const [streetError, setStreetError] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [zipError, setZipError] = useState("");
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [geoDisplay, setGeoDisplay] = useState("");
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      return;
    }
    setGeoStatus("loading");
    setGeoDisplay("");
    setGeoCoords(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGeoCoords({ lat: latitude, lng: longitude });
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        )
          .then((r) => r.json())
          .then((data) => {
            const display =
              data?.display_name ??
              `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
            setGeoDisplay(display);
            setGeoStatus("success");
            const zip = data?.address?.postcode;
            if (zip) setZipCode(zip);
          })
          .catch(() => {
            setGeoDisplay(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
            setGeoStatus("success");
          });
      },
      () => {
        setGeoStatus("error");
      },
      { timeout: 10000 }
    );
  };

  const validateZip = (val: string) => /^\d{5}(-\d{4})?$/.test(val.trim());

  const handleContinue = () => {
    let hasError = false;
    if (!streetAddress.trim()) {
      setStreetError("Please enter your street address.");
      hasError = true;
    }
    if (!zipCode.trim()) {
      setZipError("Please enter your ZIP code.");
      hasError = true;
    } else if (!validateZip(zipCode)) {
      setZipError("Enter a valid 5-digit ZIP code.");
      hasError = true;
    }
    if (hasError) return;
    update({
      streetAddress: streetAddress.trim(),
      zipCode: zipCode.trim(),
      location: geoCoords
        ? { lat: geoCoords.lat, lng: geoCoords.lng, display: geoDisplay }
        : null,
    });
    router.push("/appointments/customer-details");
  };

  const inputCls = (err?: string) =>
    `w-full rounded-xl border-2 px-4 py-3 text-sm transition-all focus:outline-none bg-white ${
      err
        ? "border-red-300 focus:border-red-400"
        : "border-gray-100 focus:border-gray-900"
    }`;

  return (
    <div className="px-8 lg:px-14 py-10 max-w-2xl">
      <ProgressBar />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Where should we ship your device?</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your ZIP code so we can prepare your shipping label.
        </p>
      </div>

      <div className="flex flex-col gap-6">

        {/* Street address */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
            Street Address
          </label>
          <input
            type="text"
            value={streetAddress}
            onChange={(e) => {
              setStreetAddress(e.target.value);
              setStreetError("");
            }}
            placeholder="e.g. 123 Main St, Apt 4B"
            className={inputCls(streetError)}
          />
          {streetError && <p className="mt-1 text-xs text-red-500">{streetError}</p>}
        </div>

        {/* ZIP code input */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
            ZIP Code
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            value={zipCode}
            onChange={(e) => {
              setZipCode(e.target.value);
              setZipError("");
            }}
            placeholder="e.g. 90210"
            className={inputCls(zipError)}
          />
          {zipError && <p className="mt-1 text-xs text-red-500">{zipError}</p>}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Get current location */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={geoStatus === "loading"}
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-fit"
          >
            {geoStatus === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            {geoStatus === "loading" ? "Detecting location…" : "Use my current location"}
          </button>

          {geoStatus === "success" && geoDisplay && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-800">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-green-600" />
              <span className="leading-relaxed">{geoDisplay}</span>
            </div>
          )}

          {geoStatus === "error" && (
            <p className="text-xs text-red-500">
              Could not detect your location. Please enter your ZIP code manually.
            </p>
          )}
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
        <Link
          href="/appointments/damage-type"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        <button
          onClick={handleContinue}
          className="px-8 py-2.5 rounded-full text-sm font-bold bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-150"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
