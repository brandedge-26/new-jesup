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
            {/* Placeholder gradient — replace src with a real store photo */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-purple-50 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg
                  className="w-16 h-16 mx-auto mb-3 opacity-40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M6.75 9a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                <p className="text-sm font-medium">Store photo goes here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
