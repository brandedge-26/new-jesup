import Image from "next/image";
import Link from "next/link";

export default function TechInGoodHands() {
  return (
    <section className="w-full bg-white py-16 lg:py-20">
      <div className="px-6 lg:px-10 2xl:px-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* ── Left — image mosaic ── */}
        <div className="flex-1 w-full grid grid-cols-2 gap-3">
          {/* Large top image — spans full width */}
          <div className="col-span-2 relative h-64 rounded-2xl overflow-hidden">
            <Image
              src="/home/your-tech-is-good-hand.png"
              alt="Technician repairing a device"
              fill
              className="object-cover"
            />
            {/* Badge on image */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white">
              <p className="text-sm font-bold leading-tight">2–3 day</p>
              <p className="text-sm font-bold leading-tight">turnaround</p>
            </div>
          </div>

          {/* Bottom-left image */}
          <div className="relative h-44 rounded-2xl overflow-hidden">
            <Image
              src="/home/your-tech-is-good-h.jpeg"
              alt="Store interior"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="absolute bottom-3 left-3 text-white text-sm font-bold leading-tight">
              Certified<br />technicians
            </p>
          </div>

          {/* Bottom-right — stats card */}
          <div className="relative h-44 rounded-2xl overflow-hidden bg-primary/5 flex flex-col items-center justify-center gap-2 border border-primary/10">
            <p className="text-4xl font-black text-primary">50K+</p>
            <p className="text-sm font-medium text-gray-600 text-center px-4 leading-snug">
              devices repaired<br />and returned
            </p>
            <span className="mt-1 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
              90-day warranty
            </span>
          </div>
        </div>

        {/* ── Right — text content ── */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
              Skilled technicians
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Your device is in expert hands
            </h2>
          </div>

          <p className="text-base text-gray-500 leading-relaxed max-w-md">
            Our certified technicians have repaired over 50,000 devices — from
            shattered iPhone screens to water-damaged laptops. Ship it in and
            let us take care of the rest.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">50K+</p>
              <p className="text-xs text-gray-400 mt-0.5">Devices repaired</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-2xl font-extrabold text-gray-900">2–3 days</p>
              <p className="text-xs text-gray-400 mt-0.5">Avg. turnaround</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-2xl font-extrabold text-gray-900">4.9★</p>
              <p className="text-xs text-gray-400 mt-0.5">Avg. rating</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/appointments"
              className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors duration-150"
            >
              Start a repair
            </Link>
            <Link
              href="/repair-guides"
              className="inline-flex items-center px-6 py-3 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors duration-150"
            >
              Browse repair guides
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
