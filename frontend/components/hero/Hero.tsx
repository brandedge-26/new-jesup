import Image from "next/image";
import Link from "next/link";

const devices = [
  {
    label: "Phone",
    image: "/header-images/phone-repair/iphone.png",
    href: "/phone-repair",
  },
  {
    label: "Computer",
    image: "/header-images/tech-repair/computer.png",
    href: "/tech-repair/computer",
  },
  {
    label: "Tablet",
    image: "/header-images/tech-repair/ipad.png",
    href: "/tech-repair/tablet",
  },
  {
    label: "Game console",
    image: "/header-images/tech-repair/game-console.png",
    href: "/tech-repair/gaming-console",
  },
];

export default function Hero() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* ── Left content ── */}
        <div className="flex-1 flex flex-col items-start">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight max-w-lg">
            When your tech stops working, we start
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-w-md">
            At Jesup, we offer quality repairs and services for the devices you
            depend on most.
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

          {/* Bottom note */}
          <p className="mt-6 text-sm text-gray-600 max-w-md leading-relaxed">
            Don&apos;t see your device? We repair any device with a power
            button.{" "}
            <Link
              href="/start-repair"
              className="text-primary font-semibold underline underline-offset-2 hover:text-primary-hover transition-colors"
            >
              Start a repair
            </Link>
          </p>
        </div>

        {/* ── Right image ── */}
        <div className="flex-1 w-full max-w-xl lg:max-w-none">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src="/home/hero.jpeg"
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
