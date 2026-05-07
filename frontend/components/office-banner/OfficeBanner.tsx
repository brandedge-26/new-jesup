export default function OfficeBanner() {
  return (
    <section className="w-full px-6 lg:px-10 2xl:px-16 py-10">
      <div
        className="relative w-full rounded-3xl overflow-hidden min-h-[220px] flex items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay — heavier on the left, fades right */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-gray-950/20" />

        {/* Content */}
        <div className="relative z-10 px-10 lg:px-16 py-12 max-w-xl">
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary mb-3">
            Our Shop
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
            Expert Repairs — Done Right,<br className="hidden sm:block" /> Every Single Time
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Ship your device to Jesup Wireless and our certified technicians will
            diagnose, fix, and return it — fast. Genuine parts, 90-day warranty,
            zero surprises.
          </p>
        </div>
      </div>
    </section>
  );
}
