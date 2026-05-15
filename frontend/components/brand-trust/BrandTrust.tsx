import Image from "next/image";
import Link from "next/link";

const brands = [
  {
    label: "Samsung repair service",
    image: "/home/brand-trust/samsung-service-center.png",
    href: "/repairs/smartphone/samsung",
  },
  {
    label: "Apple repair service",
    image: "/home/brand-trust/apple-repair-provider.png",
    href: "/repairs/smartphone/iphone",
  },
  {
    label: "Google repair service",
    image: "/home/brand-trust/google-service-provider.png",
    href: "/repairs/smartphone/google",
  },
  {
    label: "Xbox repair service",
    image: "/home/brand-trust/xbox-service-provider.png",
    href: "/repairs/gaming-console",
  },
  {
    label: "Microsoft Surface repair",
    image: "/home/brand-trust/Surface_repair_half.png",
    href: "/repairs/laptop-computers",
  },
  {
    label: "Dell repair service",
    image: "/home/brand-trust/dell_card.png",
    href: "/repairs/laptop-computers",
  },
];

export default function BrandTrust() {
  return (
    <section className="w-full bg-white py-16 lg:py-20">
      <div className="px-6 lg:px-10 2xl:px-16">

        {/* Heading */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
            Certified repair partner
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Trusted by the world&apos;s top tech brands
          </h2>
          <p className="mt-3 text-gray-500 text-base max-w-xl">
            Jesup Wireless is a certified repair partner for the brands you rely
            on every day — genuine parts, factory standards, full warranty.
          </p>
        </div>

        {/* Brand cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.label}
              href={brand.href}
              className="group flex flex-col rounded-2xl border border-gray-200 overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-200"
            >
              {/* Image — fills card exactly */}
              <div className="overflow-hidden">
                <Image
                  src={brand.image}
                  alt={brand.label}
                  width={0}
                  height={0}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Label */}
              <div className="px-3 py-3 bg-white">
                <p className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-primary transition-colors">
                  {brand.label}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
