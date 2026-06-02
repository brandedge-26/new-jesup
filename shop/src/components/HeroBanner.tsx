"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    desktop: "/home/banner/accessori-desktop-banner.jpeg",
    mobile:  "/home/banner/accessori-mobile-banner.jpeg",
    badge:   "New Collection",
    title:   "Gear Up.\nStay Protected.",
    body:    "Premium cases, screen protectors & chargers — expert-picked for every device.",
    cta1:    { label: "Shop Collections", href: "/collections" },
    cta2:    { label: "View Deals",       href: "/collections/deals" },
  },
  {
    desktop: "/home/banner/game-desktop-banner.jpeg",
    mobile:  "/home/banner/game-mobile-banner.jpeg",
    badge:   "For Gamers",
    title:   "Level Up\nYour Setup.",
    body:    "Controllers, grips & accessories built to give you the edge you need.",
    cta1:    { label: "Shop Now",    href: "/collections" },
    cta2:    { label: "Browse All",  href: "/collections/deals" },
  },
  {
    desktop: "/home/banner/heapphone-desktop-banner.jpeg",
    mobile:  "/home/banner/headphone-mobile-banner.jpeg",
    badge:   "Top Audio Picks",
    title:   "Sound Like\nNever Before.",
    body:    "Earbuds & over-ear headphones handpicked for clarity, comfort & deep bass.",
    cta1:    { label: "Shop Audio",  href: "/collections/audio" },
    cta2:    { label: "View Deals",  href: "/collections/deals" },
  },
];

const INTERVAL_MS = 5000;

export default function HeroBanner() {
  const [active, setActive]   = useState(0);
  const [paused, setPaused]   = useState(false);
  const timerRef              = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number) => {
    setActive(idx);
  }, []);

  const prev = useCallback(() => {
    setActive((a) => (a - 1 + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => {
    setActive((a) => (a + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % slides.length);
    }, INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused]);

  return (
    <section
      className="relative overflow-hidden mx-3 sm:mx-4 lg:mx-6 mt-4 rounded-2xl select-none"
      style={{ height: "calc(100vh - 100px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slides ── */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === active ? 1 : 0, zIndex: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          {/* Desktop image */}
          <Image
            src={slide.desktop}
            alt=""
            fill
            className="object-cover hidden md:block"
            priority={i === 0}
            sizes="100vw"
          />
          {/* Mobile image */}
          <Image
            src={slide.mobile}
            alt=""
            fill
            className="object-cover block md:hidden"
            priority={i === 0}
            sizes="100vw"
          />
          {/* Gradient overlay — bottom-up on mobile, left-to-right on desktop */}
          <div className="absolute inset-0 rounded-2xl
            bg-gradient-to-t from-black/80 via-black/40 to-black/10
            md:bg-none" />
          <div className="absolute inset-0 rounded-2xl hidden
            md:block md:bg-gradient-to-r md:from-black/65 md:via-black/25 md:to-transparent" />
        </div>
      ))}

      {/* ── Content (always on top) ── */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 flex flex-col
            justify-end pb-10 px-5
            md:justify-center md:pb-0 md:px-10 lg:px-14
            transition-all duration-700 z-10"
          style={{
            opacity:   i === active ? 1 : 0,
            transform: i === active ? "translateY(0)" : "translateY(12px)",
            pointerEvents: i === active ? "auto" : "none",
          }}
          aria-hidden={i !== active}
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-white/75 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 w-fit mb-3">
            {slide.badge}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-tight max-w-lg drop-shadow-md whitespace-pre-line">
            {slide.title}
          </h1>
          {/* Body hidden on mobile — avoids overlap with image subject */}
          <p className="hidden sm:block mt-3 text-sm sm:text-base text-white/80 max-w-sm leading-relaxed drop-shadow">
            {slide.body}
          </p>
          <div className="mt-4 sm:mt-7 flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-start w-fit">
            <Link
              href={slide.cta1.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 sm:px-7 py-2.5 sm:py-3 text-sm font-bold text-gray-900 shadow-lg hover:bg-gray-100 transition-all group"
            >
              {slide.cta1.label}
              <svg className="w-4 h-4 text-primary transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href={slide.cta2.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 sm:px-7 py-2.5 sm:py-3 text-sm font-bold text-white shadow-lg hover:bg-primary-hover transition-all border border-primary/60"
            >
              {slide.cta2.label}
            </Link>
          </div>
        </div>
      ))}

      {/* ── Arrow buttons — hidden on mobile, visible on sm+ ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm border border-white/20 text-white hover:bg-black/45 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm border border-white/20 text-white hover:bg-black/45 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* ── Progress bar ── */}
      {!paused && (
        <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-white/15 rounded-b-2xl overflow-hidden">
          <div
            key={active}
            className="h-full bg-white/60 rounded-b-2xl"
            style={{ animation: `progress ${INTERVAL_MS}ms linear forwards` }}
          />
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}
