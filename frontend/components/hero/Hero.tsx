import Image from "next/image";
import Link from "next/link";

const devices = [
  {
    label: "Phone",
    image: "/header-images/phone-repair/iphone.png",
    href: "/repairs/smartphone",
  },
  {
    label: "Computer",
    image: "/header-images/tech-repair/computer.png",
    href: "/repairs/laptop-computers",
  },
  {
    label: "Tablet",
    image: "/header-images/tech-repair/ipad.png",
    href: "/repairs/tablets",
  },
  {
    label: "Game console",
    image: "/header-images/tech-repair/game-console.png",
    href: "/repairs/gaming-console",
  },
];

export default function Hero() {
  return (
    <section className="w-full bg-white">
      <div className="px-6 lg:px-10 2xl:px-16 py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* ── Left content ── */}
        <div className="flex-1 flex flex-col items-start">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight max-w-lg">
            Cracked screen? Dead battery? We fix it fast.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-w-md">
            Ship your device to Jesup Wireless and get it back fixed, tested,
            and ready to go — usually within 2–3 business days.
          </p>

          {/* Device cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
            {devices.map((device) => (
              <Link
                key={device.label}
                href={device.href}
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all duration-150 group"
              >
                <div className="relative w-16 h-14">
                  <Image
                    src={device.image}
                    alt={device.label}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm text-gray-700 font-medium group-hover:text-primary transition-colors">
                  {device.label}
                </span>
              </Link>
            ))}
          </div>

          {/* CTA button — visible on mobile only */}
          <Link
            href="/appointments"
            className="mt-7 lg:hidden w-full text-center py-3.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-150"
          >
            Start a repair →
          </Link>


        </div>

        {/* ── Right image ── */}
        <div className="flex-1 w-full max-w-xl lg:max-w-none">
          <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src="/home/hero2.JPG"
              alt="Repair store"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
