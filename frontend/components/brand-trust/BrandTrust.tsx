import Image from "next/image";
import Link from "next/link";

const brands = [
  {
    label: "Start a Samsung repair",
    image: "/home/brand-trust/samsung-service-center.png",
    href: "/tech-repair/samsung",
  },
  {
    label: "Start an Apple repair",
    image: "/home/brand-trust/apple-repair-provider.png",
    href: "/phone-repair/iphone",
  },
  {
    label: "Start a Google repair",
    image: "/home/brand-trust/google-service-provider.png",
    href: "/phone-repair/google",
  },
  {
    label: "Start an Xbox repair",
    image: "/home/brand-trust/xbox-service-provider.png",
    href: "/tech-repair/gaming-console",
  },
  {
    label: "Start a Surface repair",
    image: "/home/brand-trust/Surface_repair_half.png",
    href: "/tech-repair/computer",
  },
  {
    label: "Start a Dell repair",
    image: "/home/brand-trust/dell_card.png",
    href: "/tech-repair/computer",
  },
];

export default function BrandTrust() {
  return (
    <section className="w-full bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
            Authorized service provider
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            The brand other brands trust
          </h2>
          <p className="mt-3 text-gray-500 text-base max-w-xl">
            Jesup is an authorized repair provider for the world&apos;s top
            tech brands. Cue the mic drop.
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
