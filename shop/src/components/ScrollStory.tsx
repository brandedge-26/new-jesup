"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    tag: "Drop Protection",
    title: "Built to survive the drop.",
    body: "From everyday commutes to rugged adventures — our cases guard your device without the bulk. MagSafe-ready, drop-tested, and styled to match your life.",
    cta: { label: "Shop Cases", href: "/collections/cases" },
    image: "/home/scroll-story/new-purple-phone-case.png",
    accent: "#8223D2",
  },
  {
    tag: "Wireless Audio",
    title: "Sound that moves with you.",
    body: "True wireless earbuds and over-ear headphones engineered for real-life listening. Crystal-clear calls, deep bass, and all-day comfort — no wires, no compromise.",
    cta: { label: "Shop Audio", href: "/collections/audio" },
    image: "/home/scroll-story/new-blue-headphone.png",
    accent: "#1d4ed8",
  },
  {
    tag: "Fast Charging",
    title: "Stay charged, stay ready.",
    body: "GaN chargers, Qi2 pads, and braided cables that outlast your device. Go from 0 to full in minutes — at home, in the car, or on the road.",
    cta: { label: "Shop Power", href: "/collections/power" },
    image: "/home/scroll-story/new-green-chargerr.png",
    accent: "#16a34a",
  },
  {
    tag: "Screen Guards",
    title: "See clearly. Stay protected.",
    body: "Tempered glass protectors for every device. Oleophobic coating keeps fingerprints away while military-grade hardness stops scratches dead.",
    cta: { label: "Shop Screen Protection", href: "/collections/screen-protection" },
    image: "/home/scroll-story/new-yellow-screen-protectors.png",
    accent: "#d97706",
  },
];

export default function ScrollStory() {
  const [active, setActive] = useState(0);
  const [prevActive, setPrev] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = -rect.top;                          // px scrolled into container
      const total = rect.height - window.innerHeight;  // total scrollable range
      const fraction = Math.min(1, Math.max(0, scrolled / total));
      const idx = Math.min(steps.length - 1, Math.floor(fraction * steps.length));
      if (idx !== active) {
        setPrev(active);
        setActive(idx);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  return (
    /* Scroll container — height = steps × 100vh gives the scrollable distance */
    <div
      ref={containerRef}
      style={{ height: `${steps.length * 100}vh` }}
      className="relative"
    >
      {/* Sticky panel — stays in viewport while user scrolls through the container */}
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        <div className="h-full grid lg:grid-cols-2">

          {/* ── Left: one text block visible at a time ── */}
          <div className="relative flex items-center overflow-hidden px-6 sm:px-10 lg:px-14">

            {/* Section label — always visible at top */}
            <div className="absolute top-10 left-6 sm:left-10 lg:left-14 z-10">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1">
                Why Jesup
              </span>
            </div>

            {steps.map((step, i) => {
              const isActive = i === active;
              const wasActive = i === prevActive;
              const goingDown = prevActive !== null && active > prevActive;

              return (
                <div
                  key={i}
                  className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-14"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive
                      ? "translateY(0px)"
                      : wasActive
                        ? `translateY(${goingDown ? -60 : 60}px)`
                        : `translateY(${goingDown ? 60 : -60}px)`,
                    transition: "opacity 0.6s ease, transform 0.6s ease",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  aria-hidden={!isActive}
                >
                  {/* Watermark image — mobile only (hidden on lg+) */}
                  <div className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none select-none opacity-[0.12]">
                    <Image
                      src={step.image}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="192px"
                      aria-hidden
                    />
                  </div>

                  {/* Tag */}
                  <span
                    className="inline-block text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 w-fit mb-4"
                    style={{ background: `${step.accent}18`, color: step.accent }}
                  >
                    {step.tag}
                  </span>

                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-5 max-w-sm">
                    {step.title}
                  </h2>

                  {/* Body */}
                  <p className="text-gray-500 text-sm lg:text-base leading-relaxed max-w-sm mb-8">
                    {step.body}
                  </p>

                  {/* CTA */}
                  <Link
                    href={step.cta.href}
                    className="inline-flex items-center gap-2 rounded-full text-white text-sm font-bold px-6 py-3 w-fit shadow-md transition-all hover:opacity-90 active:scale-95"
                    style={{ background: step.accent }}
                  >
                    {step.cta.label}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              );
            })}

            {/* Step counter + dots */}
            <div className="absolute bottom-10 left-6 sm:left-10 lg:left-14 flex items-center gap-3 z-10">
              <span className="text-xs font-bold text-gray-400 tabular-nums">
                {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1.5">
                {steps.map((s, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-400"
                    style={{
                      width: i === active ? 20 : 6,
                      height: 6,
                      background: i === active ? s.accent : "#e5e7eb",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Vertical progress bar on left edge */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-100">
              <div
                className="w-full bg-primary rounded-full transition-all duration-500"
                style={{ height: `${((active + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* ── Right: sticky image (desktop) / hidden on mobile ── */}
          <div className="hidden lg:flex items-center justify-center relative overflow-hidden bg-gray-50">
            {steps.map((step, i) => {
              const isActive = i === active;
              const wasActive = i === prevActive;
              const goingDown = prevActive !== null && active > prevActive;

              return (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center p-10"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive
                      ? "translateY(0px) scale(1)"
                      : wasActive
                        ? `translateY(${goingDown ? -40 : 40}px) scale(0.97)`
                        : `translateY(${goingDown ? 40 : -40}px) scale(0.97)`,
                    transition: "opacity 0.65s ease, transform 0.65s ease",
                    zIndex: isActive ? 2 : 1,
                  }}
                  aria-hidden={!isActive}
                >
                  {/* Subtle accent bg circle */}
                  <div
                    className="absolute w-72 h-72 rounded-full blur-3xl opacity-20"
                    style={{ background: step.accent }}
                  />

                  {/* Image — contain so full image is visible */}
                  <div className="relative w-full h-full max-w-md max-h-[70vh]">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-contain drop-shadow-2xl"
                      sizes="40vw"
                    />
                  </div>

                  {/* Floating tag */}
                  <div
                    className="absolute top-8 right-8 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white shadow-xl"
                    style={{ background: `${step.accent}dd`, backdropFilter: "blur(8px)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {step.tag}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
