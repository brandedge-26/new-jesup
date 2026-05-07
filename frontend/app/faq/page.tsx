"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

type FaqItem = { q: string; a: string };
type FaqCategory = { label: string; items: FaqItem[] };

const faqs: FaqCategory[] = [
  {
    label: "Repairs",
    items: [
      {
        q: "What does Jesup Wireless fix?",
        a: "Jesup Wireless is a mail-in electronics repair service specializing in cell phones, tablets, laptops, computers, and game consoles. Whether you need a cracked screen replaced, a battery swapped, a charging port fixed, or water damage repaired — our certified technicians handle it all. We service all major brands including Apple, Samsung, Google, LG, Sony, Nintendo, and more.",
      },
      {
        q: "Does Jesup Wireless fix game consoles and controllers?",
        a: "Yes! We repair PlayStation, Xbox, Nintendo Switch, and other major gaming consoles. Common repairs include HDMI port replacement, disc reader issues, controller stick drift, and power problems. Ship it in and we'll get your gaming setup back up and running.",
      },
      {
        q: "My device has liquid damage. Can you fix it?",
        a: "We can! Liquid damage repairs start with a thorough diagnostic to assess the extent of the damage. We clean the board, replace damaged components, and fully test functionality. Note that liquid damage repairs are more complex and are not covered under our standard 90-day warranty — but we'll always provide a clear quote before doing any work.",
      },
      {
        q: "How long will my repair take?",
        a: "Most mail-in repairs are completed within 1–2 business days of receiving your device. After the repair, we ship it back to you — typical total turnaround is 3–5 business days from the day you drop it off at the courier. Complex repairs may take a little longer, and we'll always keep you informed along the way.",
      },
      {
        q: "Does Jesup Wireless fix cracked phone screens?",
        a: "Absolutely — cracked screens are our most common repair. We replace displays on all major models including iPhone, Samsung Galaxy, Google Pixel, Motorola, and more. We use high-quality replacement parts and test every screen before shipping your device back.",
      },
      {
        q: "My device isn't charging. Can you fix it?",
        a: "Yes. Charging issues are usually caused by a damaged charging port, a worn-out battery, or software problems. We diagnose the root cause first, then send you a clear quote — before any repair work begins. You only pay if you approve.",
      },
      {
        q: "Do you offer free diagnostics?",
        a: "Yes! Every device we receive gets a free inspection. We'll identify the issue and send you a repair quote at no charge. You're never obligated to approve the repair. For complex issues requiring a deeper teardown, a small advanced troubleshooting fee may apply — but it's credited toward your repair cost if you move forward.",
      },
    ],
  },
  {
    label: "Pricing & Warranties",
    items: [
      {
        q: "How much will my repair cost?",
        a: "Repair costs vary depending on your device model and the type of repair needed. After we receive and diagnose your device, we'll send you an exact quote with no hidden fees. If you decide not to proceed, we'll ship your device back to you at no charge.",
      },
      {
        q: "Does Jesup Wireless use certified parts?",
        a: "Yes. We use high-quality, certified components for all repairs. For Apple and Samsung devices, we use manufacturer-approved parts wherever possible to maintain device performance, integrity, and warranty coverage.",
      },
      {
        q: "Is Jesup Wireless Samsung certified?",
        a: "Yes, Jesup Wireless is a Samsung-authorized repair provider. Our technicians are trained and certified by Samsung, and we use genuine Samsung parts — so your device's warranty stays intact after the repair.",
      },
      {
        q: "Are repairs covered by a warranty?",
        a: "Yes. Every repair completed by Jesup Wireless comes with a 90-day limited warranty. If the same issue reoccurs within 90 days of your repair, we'll fix it free of charge. Liquid damage repairs and damage caused by physical mishandling after the repair are not covered.",
      },
      {
        q: "Will Jesup Wireless match a competitor's price?",
        a: "Yes! Find a lower published price for the same repair at a local competitor? Show us and we'll match it — and beat it by $5. The price must be a standard published rate from a brick-and-mortar repair shop, not a temporary promotion, coupon, or online-only deal.",
      },
      {
        q: "Is Jesup Wireless Apple certified?",
        a: "Yes, Jesup Wireless is an Apple Authorized Service Provider. Our technicians are Apple-certified and use genuine Apple parts, so your device stays fully covered under Apple's warranty and performs exactly as intended.",
      },
      {
        q: "Is Jesup Wireless Google certified?",
        a: "Yes! We are an authorized Google repair partner. We use genuine Google parts and certified repair methods for Pixel phones and other Google devices, ensuring your device is repaired to the highest standard.",
      },
    ],
  },
  {
    label: "Other Services",
    items: [
      {
        q: "Does Jesup Wireless sell phones?",
        a: "Our primary focus is repair. We don't sell brand-new phones, but we do carry a selection of certified accessories. Our goal is to help you get the most out of the device you already own — at a fraction of the replacement cost.",
      },
      {
        q: "Does Jesup Wireless only do repairs?",
        a: "Repairs are our specialty, but we also sell accessories including cases, screen protectors, chargers, audio gear, and more. Visit our shop to browse our full catalog.",
      },
      {
        q: "Do you recycle old, outdated, or unwanted tech?",
        a: "Yes! We support responsible e-waste recycling. If you have old devices you no longer need, reach out to us and we'll help you dispose of them safely and sustainably — keeping harmful materials out of landfills.",
      },
      {
        q: "Does Jesup Wireless sell cases and accessories?",
        a: "Yes! We stock a handpicked selection of protective cases, tempered glass screen protectors, charging cables, power banks, and audio accessories for all major device brands. Add an accessory to your order when submitting a repair request, or shop our full collection online.",
      },
      {
        q: "Can Jesup Wireless clean my device?",
        a: "Yes. Device cleaning is available as a standalone service or as a free add-on with any repair. We clean charging ports, speakers, screens, and device exteriors — a great option if your phone has been through a rough stretch.",
      },
    ],
  },
  {
    label: "Mail-In Service",
    items: [
      {
        q: "How does the mail-in repair process work?",
        a: "It's simple: (1) Submit your repair request online and describe your issue. (2) We email you a free pre-paid shipping label. (3) Pack your device securely and drop it off at any courier location. (4) We receive it, diagnose it, and send you a clear quote. (5) Once you approve, we repair it and ship it back — typically within 2–3 business days of approval.",
      },
      {
        q: "How do I start a repair?",
        a: "Click 'Start a Repair' at the top of the page, select your device type and model, describe the issue, and enter your contact details. We'll handle everything from there — no store visit required.",
      },
      {
        q: "How do I cancel or reschedule a repair?",
        a: "If you haven't shipped your device yet, contact us and we'll cancel or adjust your request at no charge. If your device is already in transit or we've received it, reach out as soon as possible and we'll do our best to accommodate you.",
      },
      {
        q: "Is my device safe during shipping?",
        a: "Yes. We provide insured, tracked shipping labels for both inbound and return shipments. We recommend packing your device in bubble wrap inside a small, sturdy box. If a device arrives damaged due to insufficient packing, we'll notify you before taking any further action.",
      },
      {
        q: "Should I back up my data before sending my device?",
        a: "Absolutely — we strongly recommend backing up all your data before shipping. While we take every precaution to protect your information, certain repairs (particularly logic board work or liquid damage) may result in data loss. Jesup Wireless is not responsible for any data lost during the repair process.",
      },
      {
        q: "What should I do before shipping my device?",
        a: "Before dropping it off: (1) Back up your data. (2) Disable Find My iPhone or Factory Reset Protection so we can run diagnostics. (3) Remove your SIM card and all accessories. (4) Note your screen lock passcode — our technicians may need it for testing.",
      },
      {
        q: "Can I track my repair status?",
        a: "Yes. You'll receive email updates at each stage — received, diagnosed, quoted, repaired, and shipped. You can also contact our support team at any time for a status update.",
      },
    ],
  },
];

type SearchResult = {
  catIdx: number;
  itemIdx: number;
  catLabel: string;
  q: string;
  a: string;
};

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const searchResults: SearchResult[] = search.trim()
    ? faqs.flatMap((cat, catIdx) =>
      cat.items
        .map((item, itemIdx) => ({ catIdx, itemIdx, catLabel: cat.label, q: item.q, a: item.a }))
        .filter(
          (r) =>
            r.q.toLowerCase().includes(search.toLowerCase()) ||
            r.a.toLowerCase().includes(search.toLowerCase())
        )
    )
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (catIdx: number, itemIdx: number) => {
    const key = `${catIdx}-${itemIdx}`;
    setSearch("");
    setDropdownOpen(false);
    setActiveCategory(catIdx);
    setOpenIndex(itemIdx);
    setTimeout(() => {
      itemRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));
  const currentItems = faqs[activeCategory].items;

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero — WHITE ── */}
      <div className="bg-white border-b border-gray-100 px-6 lg:px-10 2xl:px-16 py-16 lg:py-20">
        <div className="flex flex-col items-center text-center">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
            Help Center
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4 max-w-2xl">
            Frequently asked questions
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-xl mb-8">
            Everything you need to know about Jesup Wireless repairs, pricing,
            and our mail-in service. Can&apos;t find what you&apos;re looking for?{" "}
            <a href="/contact" className="text-primary underline underline-offset-2 hover:text-primary-hover transition-colors">
              Contact us
            </a>.
          </p>

          {/* ── Search with dropdown ── */}
          <div ref={searchWrapperRef} className="relative w-full max-w-lg ">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setDropdownOpen(true); }}
              onFocus={() => { if (search.trim()) setDropdownOpen(true); }}
              placeholder="Search questions..."
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-11 pr-10 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); setDropdownOpen(false); }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* ── Dropdown ── */}
            {dropdownOpen && search.trim() && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="px-5 py-6 text-center text-sm text-gray-400">
                    No questions found for &quot;{search}&quot;
                  </div>
                ) : (
                  searchResults.map((r) => (
                    <button
                      key={`${r.catIdx}-${r.itemIdx}`}
                      onMouseDown={(e) => { e.preventDefault(); handleResultClick(r.catIdx, r.itemIdx); }}
                      className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0 transition-colors group"
                    >
                      <Search className="w-3.5 h-3.5 text-gray-300 mt-0.5 shrink-0 group-hover:text-primary transition-colors" />
                      <div className="min-w-0">
                        {/* <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">
                          {r.catLabel}
                        </p> */}
                        <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900 leading-snug truncate">
                          {r.q}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-6 lg:px-10 2xl:px-16 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Category sidebar ── */}
          <aside className="lg:w-56 shrink-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              Categories
            </p>
            <nav className="flex flex-row lg:flex-col gap-2 flex-wrap">
              {faqs.map((cat, i) => (
                <button
                  key={cat.label}
                  onClick={() => { setActiveCategory(i); setOpenIndex(null); setSearch(""); }}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${activeCategory === i
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  {cat.label}
                  <span className={`ml-2 text-xs font-bold ${activeCategory === i ? "text-gray-400" : "text-gray-300"}`}>
                    {cat.items.length}
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          {/* ── Accordion ── */}
          <div className="flex-1 max-w-3xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">{faqs[activeCategory].label}</h2>
              <p className="text-sm text-gray-400 mt-1">{currentItems.length} questions</p>
            </div>

            <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
              {currentItems.map((item, i) => {
                const isOpen = openIndex === i;
                const key = `${activeCategory}-${i}`;
                return (
                  <div
                    key={item.q}
                    ref={(el) => { itemRefs.current[key] = el; }}
                    className="bg-white"
                  >
                    <button
                      onClick={() => toggle(i)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors duration-150"
                    >
                      <span className={`text-sm font-semibold leading-snug transition-colors ${isOpen ? "text-primary" : "text-gray-900"}`}>
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : "text-gray-400"}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6">
                        <p className="text-sm text-gray-500 leading-relaxed border-l-2 border-primary pl-4">
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA strip ── */}
      <div className="mx-6 lg:mx-10 2xl:mx-16 mb-12 rounded-2xl bg-gray-950 px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Still have questions?</h3>
          <p className="text-sm text-gray-400">Our support team is happy to help — reach out any time.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/contact"
            className="px-6 py-2.5 rounded-full border border-white/20 text-sm font-semibold text-white hover:border-white/50 transition-colors"
          >
            Contact us
          </a>
          <a
            href="/appointments"
            className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Start a repair
          </a>
        </div>
      </div>

    </div>
  );
}
