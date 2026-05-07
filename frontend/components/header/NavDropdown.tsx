"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DropdownPanel } from "./dropdownData";

interface NavDropdownProps {
  panel: DropdownPanel;
}

export default function NavDropdown({ panel }: NavDropdownProps) {
  const regularItems = panel.items.filter((i) => !i.isArrow);
  const allLink = panel.items.find((i) => i.isArrow);
  const ctaHref = panel.shopLink?.href ?? allLink?.href ?? "#";

  const [active, setActive] = useState(regularItems[0]);

  return (
    <div className="flex min-h-0">
      {/* ── Left live preview ── */}
      <div className="w-64 shrink-0 flex flex-col items-center justify-center gap-5 p-8 bg-gray-50 border-r border-gray-100">
        {/* Device image — fades on change via key */}
        <div key={active.label} className="relative w-36 h-28 animate-dropdown-in">
          {active.image && (
            <Image
              src={active.image}
              alt={active.label}
              fill
              className="object-contain drop-shadow-md"
            />
          )}
        </div>

        {/* Device name */}
        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            {panel.title}
          </p>
          <h4 className="text-base font-bold text-gray-900">{active.label}</h4>
        </div>

        {/* CTA */}
        <Link
          href={active.href}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shadow-sm"
        >
          Repair {active.label}
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      {/* ── Right list ── */}
      <div className="flex-1 bg-white flex flex-col justify-center px-4 py-5">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3">
          Choose a device
        </p>

        <div className={`grid gap-0.5 ${regularItems.length > 5 ? "grid-cols-2" : "grid-cols-1"}`}>
          {regularItems.map((item) => {
            const isActive = active.label === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={() => setActive(item)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                  isActive
                    ? "bg-primary/8 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                {/* Active indicator dot */}
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-150 ${
                    isActive ? "bg-primary" : "bg-gray-200 group-hover:bg-gray-400"
                  }`}
                />

                {/* Small thumbnail */}
                {item.image && (
                  <div className="relative w-8 h-6 shrink-0">
                    <Image src={item.image} alt={item.label} fill className="object-contain" />
                  </div>
                )}

                {/* Label */}
                <span className={`flex-1 text-sm font-medium leading-snug transition-colors`}>
                  {item.label}
                </span>

                {/* Arrow — only on active */}
                <svg
                  className={`w-3.5 h-3.5 shrink-0 transition-all duration-150 ${
                    isActive ? "text-primary opacity-100" : "text-gray-200 opacity-0 group-hover:opacity-100"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>

        {/* View all */}
        <Link
          href={ctaHref}
          className="mt-3 mx-3 flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-primary transition-colors"
        >
          <span>View all options</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
