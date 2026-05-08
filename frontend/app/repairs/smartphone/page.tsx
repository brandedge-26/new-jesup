import Link from "next/link";
import Image from "next/image";
import {
  Smartphone, CalendarCheck, CheckCircle2, ChevronRight,
  Trophy, Zap, Search, BadgeDollarSign, Shield, MapPin,
} from "lucide-react";
import { brands } from "./[brand]/brandData";

export const metadata = {
  title: "Smartphone Repairs | Jesup",
  description:
    "Find the right repair for your smartphone. Jesup repairs iPhone, Samsung, Google Pixel, Motorola, LG, and more at 700+ locations with free diagnostics and a 1-year warranty.",
};

const trustPoints = [
  { Icon: Trophy,          title: "Certified technicians",  desc: "Trained experts at every location." },
  { Icon: Zap,             title: "Same-day service",        desc: "Most repairs done in under an hour." },
  { Icon: Search,          title: "Free diagnostics",        desc: "No charge to find out what's wrong." },
  { Icon: BadgeDollarSign, title: "Lowest price guarantee",  desc: "We match any lower price, guaranteed." },
  { Icon: Shield,          title: "1-year warranty",         desc: "Every repair backed by our limited warranty." },
];

const brandList = Object.values(brands);

export default function SmartphoneRepairsPage() {
  return (
    <main className="flex-1 bg-white">

      {/* ════════════ HERO ════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 2xl:px-16 py-14 lg:py-20 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/8 px-3 py-1.5 rounded-full mb-5">
            <Smartphone className="w-3 h-3" />
            Smartphone Repairs
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-5 max-w-2xl">
            Expert repairs for every{" "}
            <span className="text-primary">smartphone</span>
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl">
            From cracked screens to dead batteries — our certified technicians repair all major smartphone brands fast, with free diagnostics and a 1-year limited warranty at 700+ locations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {[
              "Free diagnostics",
              "1-year warranty",
              "Same-day service",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-sm text-gray-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" strokeWidth={2} />
                {item}
              </span>
            ))}
          </div>
          <Link
            href="/appointments"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-colors shadow-md shadow-primary/25"
          >
            <CalendarCheck className="w-4 h-4" />
            Schedule a repair
          </Link>
        </div>
      </section>

      {/* ════════════ BRAND CARDS ════════════ */}
      <section className="py-16 px-6 lg:px-10 2xl:px-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-primary uppercase tracking-widest text-center mb-2">Select your brand</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-3">
            What phone do you have?
          </h2>
          <p className="text-sm text-gray-500 text-center mb-10">
            Choose your brand below to see models, common repairs, pricing, and more.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandList.map((brand) => (
              <Link
                key={brand.slug}
                href={`/repairs/smartphone/${brand.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* image area */}
                <div className="relative h-48 bg-white flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-4 rounded-full bg-primary/8 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Image
                    src={brand.heroImage}
                    alt={brand.name}
                    width={200}
                    height={180}
                    className="object-contain h-40 w-auto relative z-10 group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                  />
                </div>

                {/* content */}
                <div className="p-6 flex flex-col flex-1 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {brand.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">
                    {brand.tagline}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {brand.issues.slice(0, 3).map((issue) => (
                      <span
                        key={issue.label}
                        className="text-xs bg-primary/8 text-primary font-medium px-2.5 py-1 rounded-full"
                      >
                        {issue.label}
                      </span>
                    ))}
                    {brand.issues.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2.5 py-1 rounded-full">
                        +{brand.issues.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ WHY JESUP ════════════ */}
      <section className="py-16 px-6 lg:px-10 2xl:px-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative h-[22rem] rounded-3xl overflow-hidden shadow-lg">
            <Image src="/home/your-tech-is-good-h.jpeg" alt="Jesup store" fill className="object-cover" />
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
              The smartest way to fix your phone
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

      {/* ════════════ CTA BANNER ════════════ */}
      <section className="py-16 px-6 lg:px-10 2xl:px-16 bg-primary">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-3">
              Ready to fix your smartphone?
            </h2>
            <p className="text-white/75 text-sm leading-relaxed max-w-lg">
              Walk into any Jesup location — no appointment needed. Or schedule online and skip the wait.
            </p>
          </div>
          <Link
            href="/appointments"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-primary font-bold text-sm hover:bg-gray-100 transition-colors shadow-md shrink-0"
          >
            <CalendarCheck className="w-4 h-4" />
            Schedule a repair
          </Link>
        </div>
      </section>

    </main>
  );
}
