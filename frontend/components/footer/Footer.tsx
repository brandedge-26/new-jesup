import Image from "next/image";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";

const footerLinks = [
  {
    title: "Repairs",
    links: [
      { label: "iPhone repair", href: "/repairs/smartphone/iphone" },
      { label: "Samsung repair", href: "/repairs/smartphone/samsung" },
      { label: "Google repair", href: "/repairs/smartphone/google" },
      { label: "Motorola repair", href: "/repairs/smartphone/motorola" },
      { label: "Tablet repair", href: "/repairs/tablets" },
      { label: "Computer repair", href: "/repairs/laptop-computers" },
      { label: "Game console repair", href: "/repairs/gaming-console" },
      { label: "All repairs", href: "/repairs/smartphone" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Track repair", href: "/support/track" },
      { label: "Repair guides", href: "/repair-guides" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Cases", href: "https://shop.jesupwireless.com/collections/cases" },
      { label: "Screen protectors", href: "https://shop.jesupwireless.com/collections/screen-protection" },
      { label: "Power", href: "https://shop.jesupwireless.com/collections/power" },
      { label: "Audio", href: "https://shop.jesupwireless.com/collections/audio" },
      { label: "iPhone accessories", href: "https://shop.jesupwireless.com/collections/devices?q=phone" },
      { label: "Samsung accessories", href: "https://shop.jesupwireless.com/collections/devices?q=samsung" },
      { label: "Google accessories", href: "https://shop.jesupwireless.com/collections/devices?q=google" },
      { label: "Tablet & Laptop accessories", href: "https://shop.jesupwireless.com/collections/devices?q=tablet+laptop" },
      { label: "All accessories", href: "https://shop.jesupwireless.com/collections" },
    ],
  },
];

const socials = [
  {
    label: "Instagram", href: "#",
    svg: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  },
  {
    label: "Twitter/X", href: "#",
    svg: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  },
  {
    label: "Facebook", href: "#",
    svg: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  },
  {
    label: "YouTube", href: "#",
    svg: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  },
  {
    label: "LinkedIn", href: "#",
    svg: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  },
];

const bottomLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="w-full  px-4 pb-6 pt-4">
      {/* ── Rounded dark container ── */}
      <div className="bg-gray-950  rounded-3xl overflow-hidden">

        {/* Main content */}
        <div className="px-8 lg:px-12 pt-12 pb-10 grid grid-cols-1 lg:grid-cols-[220px_1fr_1fr_1fr_220px] gap-10">

          {/* Logo + tagline + socials */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="inline-block">
              <Image
                src="/jesup-footer-logo.svg"
                alt="Jesup"
                width={110}
                height={36}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Mail-in device repairs done right. Fast turnaround, genuine parts, and a 90-day warranty on every fix.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-2 mt-1">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors duration-150"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">{s.svg}</svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {footerLinks.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h4 className="text-white text-sm font-bold">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-gray-400 text-sm hover:text-white transition-colors duration-150"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold">Contact Information</h4>
            <Link
              href="tel:8773202237"
              className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-2 text-sm text-gray-300 hover:border-primary hover:text-white transition-colors duration-150 w-fit"
            >
              <Phone size={14} />
              1-800-JESUP-FIX
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-2 text-sm text-gray-300 hover:border-primary hover:text-white transition-colors duration-150 w-fit"
            >
              <Mail size={14} />
              Contact us
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-8 lg:mx-12 border-t border-white/10" />

        {/* Bottom bar */}
        <div className="px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {bottomLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-gray-500 text-xs hover:text-gray-300 underline underline-offset-2 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <span className="text-gray-500 text-xs">©Jesup {new Date().getFullYear()}</span>
          </div>
          {/* Social icons bottom-right */}
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="text-gray-500 hover:text-white transition-colors duration-150"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">{s.svg}</svg>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
