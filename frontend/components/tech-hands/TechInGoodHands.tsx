import Image from "next/image";
import Link from "next/link";

export default function TechInGoodHands() {
  return (
    <section className="w-full bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* ── Left — image mosaic ── */}
        <div className="flex-1 w-full grid grid-cols-2 gap-3">
          {/* Large top image — spans full width */}
          <div className="col-span-2 relative h-64 rounded-2xl overflow-hidden">
            <Image
              src="/home/your-tech-is-good-hand.jpeg"
              alt="Technician repairing a device"
              fill
              className="object-cover"
            />
            {/* Badge on image */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white">
              <p className="text-sm font-bold leading-tight">Same-day</p>
              <p className="text-sm font-bold leading-tight">repairs</p>
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
              700+ stores<br />nationwide
            </p>
          </div>

          {/* Bottom-right — stats card */}
          <div className="relative h-44 rounded-2xl overflow-hidden bg-purple-50 flex flex-col items-center justify-center gap-2 border border-purple-100">
            <p className="text-4xl font-black text-primary">21M+</p>
            <p className="text-sm font-medium text-gray-600 text-center px-4 leading-snug">
              repairs completed<br />by our experts
            </p>
            {/* Low price badge */}
            <span className="mt-1 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
              Low price guarantee
            </span>
          </div>
        </div>

        {/* ── Right — text content ── */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
              Trusted experts
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Your tech is in good hands
            </h2>
          </div>

          <p className="text-base text-gray-500 leading-relaxed max-w-md">
            Our local experts have completed 21 million+ repairs, and they can
            help you too — whether you need a fix, setup, accessories, or even a
            cleaning for your phone or game console.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">700+</p>
              <p className="text-xs text-gray-400 mt-0.5">Store locations</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-2xl font-extrabold text-gray-900">21M+</p>
              <p className="text-xs text-gray-400 mt-0.5">Repairs done</p>
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
              href="/store-locator"
              className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors duration-150"
            >
              Find a store
            </Link>
            <Link
              href="/start-repair"
              className="inline-flex items-center px-6 py-3 rounded-full bg-purple-100 text-primary text-sm font-semibold hover:bg-purple-200 transition-colors duration-150"
            >
              Start a repair
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
