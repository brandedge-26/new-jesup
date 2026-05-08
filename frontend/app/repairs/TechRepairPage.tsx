import Link from "next/link";
import Image from "next/image";
import {
  Monitor, Battery, PlugZap, Camera, Layers, Volume2, Droplets,
  Wifi, SlidersHorizontal, Wrench, Keyboard, HardDrive, ShieldAlert,
  Cpu, Thermometer, Disc3, Gamepad2, Move,
  Trophy, Zap, Search, BadgeDollarSign, Shield, Tablet,
  MapPin, CalendarCheck, CheckCircle2,
} from "lucide-react";
import type { TechData } from "./techData";

/* ── icon map ── */
const iconMap: Record<string, React.ElementType> = {
  Monitor, Battery, PlugZap, Camera, Layers, Volume2, Droplets,
  Wifi, SlidersHorizontal, Wrench, Keyboard, HardDrive, ShieldAlert,
  Cpu, Thermometer, Disc3, Gamepad2, Move, Tablet,
};
function IssueIcon({ name }: { name: string }) {
  const Icon = iconMap[name] ?? Wrench;
  return <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />;
}

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const reviewTexts = [
  "Fixed same day — runs like new!",
  "Super affordable and professional.",
  "Great technicians, highly recommend.",
  "Quick, honest, and reliable service.",
];

const trustPoints = [
  { Icon: Trophy,          title: "Certified technicians",    desc: "700+ locations, thousands of trained experts." },
  { Icon: Zap,             title: "Same-day service",         desc: "Most repairs done in under an hour." },
  { Icon: Search,          title: "Free diagnostics",         desc: "No charge to find out what's wrong." },
  { Icon: BadgeDollarSign, title: "Lowest price guarantee",   desc: "We match any lower price, guaranteed." },
  { Icon: Shield,          title: "1-year warranty",          desc: "Every repair backed by our limited warranty." },
];

const crossSell = [
  { label: "iPhone",         image: "/header-images/phone-repair/iphone.png",   href: "/repairs/smartphone/iphone" },
  { label: "Samsung",        image: "/header-images/phone-repair/samsung.png",  href: "/repairs/smartphone/samsung" },
  { label: "iPad",           image: "/header-images/tech-repair/ipad.png",      href: "/repairs/tablets/ipads" },
  { label: "Tablet",         image: "/header-images/tech-repair/tablet.png",    href: "/repairs/tablets" },
  { label: "Computer",       image: "/header-images/tech-repair/computer.png",  href: "/repairs/laptop-computers" },
  { label: "Gaming console", image: "/header-images/tech-repair/game-console.png", href: "/repairs/gaming-console" },
];

export default function TechRepairPage({ data }: { data: TechData }) {
  return (
    <main className="flex-1 bg-white">

      {/* ════════════ HERO ════════════ */}
      <section className="bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 2xl:px-16 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT — text */}
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/8 px-3 py-1.5 rounded-full mb-5">
              <Tablet className="w-3 h-3" />
              Tech Repair
            </span>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-5">
              {data.name}{" "}
              <span className="text-primary">Repairs</span>
            </h1>

            <p className="text-gray-500 text-base leading-relaxed mb-7 max-w-lg">
              {data.description}
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "Free diagnostics — no charge to check",
                "1-year limited warranty on every repair",
                "700+ locations, same-day service available",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/appointments"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-colors shadow-md shadow-primary/25"
            >
              <CalendarCheck className="w-4 h-4" />
              Schedule a repair
            </Link>

            <p className="mt-4 text-xs text-gray-400">
              Have a question?{" "}
              <Link href="/faq" className="text-primary underline hover:text-primary-hover">
                View FAQs →
              </Link>
            </p>
          </div>

          {/* RIGHT — device image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md h-[380px] lg:h-[440px] bg-white">
              <div className="absolute inset-8 rounded-full bg-primary/10 blur-3xl" />
              <Image
                src={data.heroImage}
                alt={data.name}
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ PURPLE TRUST BANNER ════════════ */}
      <section className="bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 2xl:px-16 py-10">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-3">
            {data.tagline}
          </h2>
          <p className="text-white/75 text-sm leading-relaxed max-w-xl">
            {data.description}
          </p>
        </div>
      </section>

      {/* ════════════ HOW IT WORKS ════════════ */}
      <section className="py-16 px-6 lg:px-10 2xl:px-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-primary uppercase tracking-widest text-center mb-2">How it works</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-12">
            Our {data.name} repairs are simple
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: 1, Icon: MapPin,        title: "Find a location", desc: `Visit one of our 700+ stores or mail in your ${data.name} for repair.` },
              { step: 2, Icon: Wrench,        title: "Get quality repairs", desc: `Our techs diagnose your ${data.name} and fix it fast with quality parts.` },
              { step: 3, Icon: CalendarCheck, title: "Sit back and relax", desc: `We notify you the moment your ${data.name} is ready to pick up.` },
            ].map((s) => (
              <div
                key={s.step}
                className="relative bg-white rounded-2xl border border-gray-200 p-7 flex flex-col items-center text-center hover:border-primary/40 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shadow-md">
                  {s.step}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mb-4 mt-3 group-hover:bg-primary/15 transition-colors">
                  <s.Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ MODELS / DEVICES WE SUPPORT ════════════ */}
      <section className="py-12 px-6 lg:px-10 2xl:px-16 border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-lg lg:text-xl font-semibold text-gray-700 text-center sm:text-left">
            We repair <span className="text-primary font-bold">all {data.name} models</span> — from the latest to older generations.
          </p>
          <Link
            href="/appointments"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-sm"
          >
            <CalendarCheck className="w-4 h-4" />
            Schedule a repair
          </Link>
        </div>
      </section>

      {/* ════════════ QUALITY / TRUST ════════════ */}
      <section className="py-16 px-6 lg:px-10 2xl:px-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

          <div className="relative h-[22rem] rounded-3xl overflow-hidden shadow-lg">
            <Image src="/home/your-tech-is-good-h.jpeg" alt="Jesup locations" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white font-bold text-xl mb-1">700+ locations nationwide</p>
              <p className="text-gray-300 text-sm">Walk in today — no appointment needed</p>
              <Link href="/contact" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full transition-colors">
                <MapPin className="w-3 h-3" /> Find nearest store →
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Why Jesup?</p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-7">
              Quality repairs, right in your neighborhood
            </h2>
            <ul className="space-y-4">
              {trustPoints.map(({ Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ════════════ REVIEWS ════════════ */}
      <section className="py-16 px-6 lg:px-10 2xl:px-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-primary uppercase tracking-widest text-center mb-2">Reviews</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-10">
            Your {data.name} is in good hands
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.models.slice(0, 4).map((model, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-primary/30 transition-all duration-200">
                <Stars />
                <p className="font-bold text-gray-900 text-sm mt-3 mb-1">{model}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{reviewTexts[i]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FAQ ════════════ */}
      <section className="py-16 px-6 lg:px-10 2xl:px-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">FAQ</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {data.name} repair at Jesup
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-2xl">
            At Jesup, our technicians are specially trained to handle all {data.name} repairs.
            Whether your screen is cracked or your battery won&apos;t hold charge, we fix it — usually
            the same day — with free diagnostics and no surprises.
          </p>
          <div className="divide-y divide-gray-200">
            {data.faqs.map((faq, i) => (
              <div key={i} className="py-6">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ ISSUES GRID ════════════ */}
      <section className="py-16 px-6 lg:px-10 2xl:px-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-primary uppercase tracking-widest text-center mb-2">Common repairs</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-2">
            We fix most {data.name} issues — fast
          </h2>
          <p className="text-sm text-gray-500 text-center mb-10">Select your problem to get started.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {data.issues.map((issue) => (
              <Link
                key={issue.label}
                href="/appointments"
                className="group flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/6 group-hover:bg-primary/12 flex items-center justify-center transition-colors duration-200">
                  <IssueIcon name={issue.icon} />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-primary text-center leading-tight transition-colors">
                  {issue.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CTA BANNER ════════════ */}
      <section className="py-16 px-6 lg:px-10 2xl:px-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden grid lg:grid-cols-[1fr_400px] bg-white border border-gray-200 shadow-sm">
            <div className="p-10 lg:p-14">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-5">
                We make {data.name} repairs easy
              </h2>
              <ul className="space-y-3 mb-8">
                {["Free diagnostics at every store", "1-year limited warranty on all repairs", "Lowest price guarantee — always", "Certified technicians only", "Same-day service available"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/appointments" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-colors shadow-md shadow-primary/25">
                <CalendarCheck className="w-4 h-4" />
                Schedule a repair today
              </Link>
            </div>
            <div className="relative min-h-64 lg:min-h-0 bg-gray-50 flex items-center justify-center overflow-hidden">
              <Image
                src={data.heroImage}
                alt={data.name}
                fill
                className="object-contain p-6"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ STORE PHOTOS ════════════ */}
      <section className="py-16 px-6 lg:px-10 2xl:px-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {["/home/hero.jpeg", "/home/hero2.JPG", "/home/your-tech-is-good-h.jpeg"].map((src, i) => (
              <div key={i} className="relative h-48 rounded-2xl overflow-hidden shadow-sm">
                <Image src={src} alt="Jesup store" fill className="object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-5">
            Visit any of our 700+ Jesup locations for fast {data.name} repairs.{" "}
            <Link href="/contact" className="text-primary underline hover:text-primary-hover">
              Find your nearest store →
            </Link>
          </p>
        </div>
      </section>

      {/* ════════════ CROSS-SELL ════════════ */}
      <section className="py-16 px-6 lg:px-10 2xl:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            What else can we fix for you?
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {crossSell
              .filter((d) => d.href !== `/repairs/tablets/${data.slug}` && d.href !== `/repairs/${data.slug}`)
              .map((device) => (
                <Link key={device.label} href={device.href} className="group flex flex-col items-center gap-2.5 p-4 bg-white rounded-2xl border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200">
                  <div className="relative w-14 h-14">
                    <Image src={device.image} alt={device.label} fill className="object-contain group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 group-hover:text-primary text-center leading-tight">
                    {device.label}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

    </main>
  );
}
