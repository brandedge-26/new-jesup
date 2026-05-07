"use client";

import { usePathname } from "next/navigation";

const steps = [
  { label: "Device", path: "/appointments/device-type" },
  { label: "Issues", path: "/appointments/damage-type" },
  { label: "Shipping", path: "/appointments/delivery-selection" },
  { label: "Details", path: "/appointments/customer-details" },
  { label: "Done", path: "/appointments/confirmation" },
];

export default function ProgressBar() {
  const pathname = usePathname();
  const currentIndex = steps.findIndex((s) => pathname.startsWith(s.path));

  return (
    <div className="mb-10">
      <div className="flex items-center">
        {steps.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isActive = i === currentIndex;
          const isLast = i === steps.length - 1;

          return (
            <div key={step.path} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-gray-900 border-gray-900 text-white"
                    : isActive
                    ? "bg-white border-gray-900 text-gray-900"
                    : "bg-white border-gray-200 text-gray-300"
                }`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : <span>{i + 1}</span>}
                </div>
                <span className={`text-[10px] font-semibold tracking-wide whitespace-nowrap ${
                  isActive ? "text-gray-900" : isCompleted ? "text-gray-400" : "text-gray-300"
                }`}>{step.label}</span>
              </div>
              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 mb-4 rounded-full overflow-hidden bg-gray-100">
                  <div className={`h-full rounded-full bg-gray-900 transition-all duration-500 ${isCompleted ? "w-full" : "w-0"}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
