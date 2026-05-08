import Link from "next/link";
import Image from "next/image";
import {
  Smartphone, Monitor, Gamepad2, Tablet, Wrench,
  Clock, ChevronRight, CalendarCheck, BookOpen,
  Droplets, Battery, Shield, Zap, CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Repair Guides & Tips | Jesup",
  description:
    "Free repair guides, tips, and how-tos for your phone, tablet, laptop, and gaming console. Learn when to DIY and when to bring it to Jesup.",
};

type Guide = {
  slug: string;
  category: string;
  categoryIcon: React.ElementType;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  featured?: boolean;
};

const guides: Guide[] = [
  {
    slug: "what-to-do-water-damage",
    category: "General",
    categoryIcon: Droplets,
    title: "What to Do Immediately After Water Damage",
    excerpt: "Dropped your phone in water? The next 60 seconds are critical. Follow these steps to give your device the best chance of survival before bringing it in.",
    image: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&w=1200&q=80",
    readTime: "4 min read",
    featured: true,
  },
  {
    slug: "iphone-battery-replacement",
    category: "iPhone",
    categoryIcon: Battery,
    title: "How to Tell If Your iPhone Battery Needs Replacing",
    excerpt: "Is your iPhone dying faster than it used to? Here are the clear signs your battery is on its way out — and when a replacement makes sense.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    readTime: "3 min read",
  },
  {
    slug: "cracked-screen-repair-vs-replace",
    category: "Phone",
    categoryIcon: Smartphone,
    title: "Cracked Screen: Repair or Replace — What's Actually Worth It?",
    excerpt: "Not every cracked screen means it's time to buy a new phone. We break down exactly when repair is the smarter and cheaper choice.",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80",
    readTime: "5 min read",
  },
  {
    slug: "laptop-battery-dying-signs",
    category: "Computer",
    categoryIcon: Monitor,
    title: "5 Signs Your Laptop Battery Is Dying (And What To Do)",
    excerpt: "Laptop not holding a charge like it used to? These warning signs tell you when it's time for a battery swap before it leaves you stranded.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    readTime: "4 min read",
  },
  {
    slug: "ps5-overheating-fix",
    category: "Gaming",
    categoryIcon: Gamepad2,
    title: "PS5 Overheating? Here's Exactly What to Do",
    excerpt: "A hot PS5 is a dangerous PS5. We walk you through common overheating causes, quick fixes you can try at home, and when to bring it in for repair.",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
    readTime: "5 min read",
  },
  {
    slug: "ipad-screen-cracked",
    category: "Tablet",
    categoryIcon: Tablet,
    title: "iPad Screen Cracked? Here's Everything You Need to Know",
    excerpt: "A cracked iPad screen is stressful, but it doesn't have to be expensive. We explain your repair options, costs, and what to expect at the store.",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    readTime: "4 min read",
  },
  {
    slug: "protect-phone-screen",
    category: "General",
    categoryIcon: Shield,
    title: "5 Simple Ways to Protect Your Phone Screen",
    excerpt: "Prevention is always cheaper than repair. These five habits will dramatically reduce your chances of a cracked screen — starting today.",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80",
    readTime: "3 min read",
  },
  {
    slug: "samsung-charging-port-fix",
    category: "Samsung",
    categoryIcon: Zap,
    title: "Samsung Not Charging? Try These Fixes First",
    excerpt: "Before you assume it's the charging port, there are a few quick things to try. We walk you through each one — and when a real repair is needed.",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80",
    readTime: "4 min read",
  },
  {
    slug: "how-long-smartphone-battery-last",
    category: "General",
    categoryIcon: Battery,
    title: "How Long Should a Smartphone Battery Last?",
    excerpt: "Most people don't know when a battery is actually failing vs. just aging normally. We explain battery health, capacity degradation, and when to act.",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80",
    readTime: "3 min read",
  },
];

const featured = guides.find((g) => g.featured)!;
const rest = guides.filter((g) => !g.featured);

const categories = [
  { label: "All",      icon: BookOpen },
  { label: "Phone",    icon: Smartphone },
  { label: "iPhone",   icon: Smartphone },
  { label: "Samsung",  icon: Smartphone },
  { label: "Tablet",   icon: Tablet },
  { label: "Computer", icon: Monitor },
  { label: "Gaming",   icon: Gamepad2 },
  { label: "General",  icon: Wrench },
];

const categoryColor: Record<string, string> = {
  iPhone:   "bg-blue-50 text-blue-600",
  Samsung:  "bg-indigo-50 text-indigo-600",
  Phone:    "bg-violet-50 text-violet-600",
  Tablet:   "bg-teal-50 text-teal-600",
  Computer: "bg-orange-50 text-orange-600",
  Gaming:   "bg-green-50 text-green-600",
  General:  "bg-primary/8 text-primary",
};

function CategoryBadge({ category, Icon }: { category: string; Icon: React.ElementType }) {
  const color = categoryColor[category] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}>
      <Icon className="w-3 h-3" />
      {category}
    </span>
  );
}

export default function RepairGuidesPage() {
  return (
    <main className="flex-1 bg-white">

      {/* ════════════ HERO ════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 2xl:px-16 py-14 lg:py-20 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/8 px-3 py-1.5 rounded-full mb-5">
            <BookOpen className="w-3 h-3" />
            Repair Guides
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-5 max-w-2xl">
            Free guides to{" "}
            <span className="text-primary">fix & protect</span>{" "}
            your tech
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl">
            Expert tips, how-to guides, and repair advice for your phone, tablet, laptop, and more — written by Jesup&apos;s certified technicians.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {["Written by certified techs", "Free, no sign-up needed", "Updated regularly"].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" strokeWidth={2} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FEATURED GUIDE ════════════ */}
      <section className="py-14 px-6 lg:px-10 2xl:px-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-6">Featured guide</p>
          <Link
            href={`/repair-guides/${featured.slug}`}
            className="group grid lg:grid-cols-2 gap-0 bg-white rounded-3xl border border-gray-200 overflow-hidden"
          >
            <div className="relative h-64 lg:h-auto min-h-[320px]">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <CategoryBadge category={featured.category} Icon={featured.categoryIcon} />
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mt-4 mb-4 leading-tight group-hover:text-primary transition-colors">
                {featured.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {featured.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readTime}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  Read guide <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ════════════ CATEGORY PILLS ════════════ */}
      <section className="px-6 lg:px-10 2xl:px-16 py-6 border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-1">
          {categories.map(({ label, icon: Icon }, i) => (
            <button
              key={label}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                i === 0
                  ? "bg-primary text-white border-primary"
                  : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ════════════ GUIDES GRID ════════════ */}
      <section className="py-14 px-6 lg:px-10 2xl:px-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All guides</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((guide) => (
              <Link
                key={guide.slug}
                href={`/repair-guides/${guide.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={guide.image}
                    alt={guide.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <CategoryBadge category={guide.category} Icon={guide.categoryIcon} />
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-primary transition-colors flex-1">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
                    {guide.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                      <Clock className="w-3 h-3" />
                      {guide.readTime}
                    </span>
                    <span className="text-xs font-bold text-primary inline-flex items-center gap-1">
                      Read <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ PRO TIP CARDS ════════════ */}
      <section className="py-14 px-6 lg:px-10 2xl:px-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-6 text-center">Quick tips</p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                Icon: Droplets,
                title: "Water damage? Act fast",
                desc: "Power off immediately. Don't charge it. Don't shake it. Bring it in within 24 hours for the best chance of recovery.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                Icon: Battery,
                title: "Battery below 80% health?",
                desc: "If your iPhone shows Battery Health under 80%, it's time for a replacement. Most take under an hour at any Jesup store.",
                color: "bg-primary/8 text-primary",
              },
              {
                Icon: Shield,
                title: "Cracked screen? Don't wait",
                desc: "A small crack gets worse fast. Glass shards can damage the display underneath. Fix it before it gets more expensive.",
                color: "bg-orange-50 text-orange-600",
              },
            ].map(({ Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-200 p-6 flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CTA ════════════ */}
      <section className="py-16 px-6 lg:px-10 2xl:px-16 bg-primary">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-3">
              Rather leave it to the experts?
            </h2>
            <p className="text-white/75 text-sm leading-relaxed max-w-lg">
              Walk into any Jesup location for a free diagnostic — no appointment needed. Our certified technicians will tell you exactly what&apos;s wrong and what it costs to fix.
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
