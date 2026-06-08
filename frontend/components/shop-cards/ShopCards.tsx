import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const cards = [
  {
    image: "/home/shop-cards/mobile-repair.jpg",
    tag: "Repair",
    title: "Send it in, get it back fixed",
    description:
      "Pack it up, print your free shipping label, and drop it off. We repair it and ship it straight back — usually within 2–3 business days.",
    cta: { label: "Start a repair", href: "/appointments" },
  },
  {
    image: "/home/shop-cards/accessories.jpg",
    tag: "Shop Online",
    title: "Accessories for every device",
    description:
      "Keep your device protected and powered up with our handpicked collection of cases, screen protectors, chargers, and audio gear.",
    cta: { label: "Shop now", href: "/shop" },
  },
  {
    image: "/home/shop-cards/mobile-laptop-ipad.jpg",
    tag: "All Devices",
    title: "Phones, laptops, tablets & more",
    description:
      "From iPhones to gaming consoles — if it has a battery or a screen, chances are we can fix it. All major brands and models covered.",
    cta: { label: "See all repairs", href: "/repairs/smartphone" },
  },
];

export default function ShopCards() {
  return (
    <section className="w-full bg-gray-50 py-16 lg:py-20">
      <div className="px-6 lg:px-10 2xl:px-16">

        {/* Heading */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
            Explore
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Everything you need, in one place
          </h2>
          <p className="mt-3 text-gray-500 text-base max-w-xl">
            Repairs, accessories, and expert support — Jesup Wireless has you
            covered from the moment something breaks to the day you need to protect it.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group flex flex-col rounded-2xl border border-gray-200 bg-white transition-colors duration-200 hover:border-primary/40"
            >
              {/* Image with spacing from card edges */}
              <div className="p-3 pb-0">
                <div className="relative h-52 rounded-xl overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  {/* Tag pill */}
                  <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {card.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-3">
                <h3 className="text-lg font-bold text-gray-900">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">
                  {card.description}
                </p>

                {/* CTA — outlined professional style */}
                <Link
                  href={card.cta.href}
                  className="mt-1 inline-flex items-center gap-2 self-start border border-primary text-primary text-sm font-semibold px-5 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-150 group/btn"
                >
                  {card.cta.label}
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-150 group-hover/btn:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
