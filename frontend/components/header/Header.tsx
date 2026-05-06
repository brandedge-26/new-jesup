"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { navItems } from "./dropdownData";
import NavDropdown from "./NavDropdown";

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLeaveTimer = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  };
  const scheduleClose = () => {
    leaveTimer.current = setTimeout(() => setActiveDropdown(null), 180);
  };

  const handleNavEnter = (label: string) => {
    clearLeaveTimer();
    setActiveDropdown(label);
  };
  const handleNavLeave = () => scheduleClose();
  const handleDropdownEnter = () => clearLeaveTimer();
  const handleDropdownLeave = () => scheduleClose();

  const activeItem = navItems.find((n) => n.label === activeDropdown);

  const toggleMobileExpanded = (label: string) => {
    setMobileExpanded((prev) => (prev === label ? null : label));
  };

  return (
    <>
      <header className="relative w-full bg-white border-b border-gray-200 z-50">
        {/* ── Main bar ── */}
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 text-2xl font-extrabold tracking-tight text-gray-900"
          >
            J<span className="text-primary">esup</span>
          </Link>

          {/* Desktop nav — centered */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navItems.map((item) => {
              const isActive = activeDropdown === item.label;
              return (
                <div
                  key={item.label}
                  className="relative h-16 flex items-center"
                  onMouseEnter={() =>
                    item.dropdown ? handleNavEnter(item.label) : undefined
                  }
                  onMouseLeave={item.dropdown ? handleNavLeave : undefined}
                >
                  <Link
                    href={item.href ?? "#"}
                    className={`flex items-center gap-1 text-sm transition-all duration-150 ${isActive
                      ? "text-gray-900 font-semibold"
                      : "text-gray-600 hover:text-gray-900 font-medium"
                      }`}
                  >
                    {item.label}
                    {item.dropdown && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isActive ? "rotate-180" : ""
                          }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </Link>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-gray-900 rounded-t-full" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Desktop buttons */}
            <Link
              href="/login"
              className="hidden lg:inline-flex items-center px-5 py-2 rounded-full border border-gray-400 text-sm font-medium text-gray-800 hover:border-gray-700 transition-colors duration-150"
            >
              Login
            </Link>
            <Link
              href="/start-repair"
              className="hidden lg:inline-flex items-center px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors duration-150"
            >
              Start a repair
            </Link>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Desktop dropdown — centered panel ── */}
        {activeItem?.dropdown && (
          <div
            className="absolute left-0 right-0 top-full pt-2 pb-4 z-40 "
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-dropdown-in">
              <NavDropdown panel={activeItem.dropdown} />
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile menu overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto animate-slide-in-right flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
              <span className="text-xl font-extrabold text-gray-900">
                J<span className="text-primary">esup</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col flex-1 px-4 py-4 gap-1">
              {navItems.map((item) => {
                const isExpanded = mobileExpanded === item.label;
                return (
                  <div key={item.label}>
                    {item.dropdown ? (
                      <>
                        <button
                          onClick={() => toggleMobileExpanded(item.label)}
                          className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {item.label}
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                              }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {isExpanded && (
                          <div className="ml-3 mt-1 flex flex-col gap-1">
                            {item.dropdown.items.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={() => setMobileOpen(false)}
                                className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href ?? "#"}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Bottom buttons */}
            <div className="flex flex-col gap-3 px-4 py-5 border-t border-gray-100 shrink-0">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-400 text-sm font-medium text-gray-800 hover:border-gray-700 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/start-repair"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
              >
                Start a repair
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
