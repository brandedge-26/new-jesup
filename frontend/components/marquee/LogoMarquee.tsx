import Image from "next/image";

const logos = [
  { name: "TechCrunch", src: "/home/company-logo/techcrunch.svg" },
  { name: "Engadget", src: "/home/company-logo/engadget.svg" },
  { name: "Gizmodo", src: "/home/company-logo/gizmodo.svg" },
  { name: "Inc 500", src: "/home/company-logo/inc500.svg" },
  { name: "VentureBeat", src: "/home/company-logo/venturebeat.svg" },
];

// Duplicate for seamless loop
const track = [...logos, ...logos];

export default function LogoMarquee() {
  return (
    <section className="w-full bg-gray-50 py-12 border-b border-gray-100 overflow-hidden">
      <div className="px-6 lg:px-10 2xl:px-16 mb-6 text-center">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Featured in
        </p>
      </div>

      {/* Marquee track */}
      <div className="relative flex overflow-hidden">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-16 whitespace-nowrap">
          {track.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="relative h-25 w-36 shrink-0 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
