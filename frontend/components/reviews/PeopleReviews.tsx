import Image from "next/image";

const reviews = [
  {
    name: "Ahmed R.",
    service: "iPhone 17 Repair",
    review:
      "Absolutely amazing service! Fixed my iPhone screen in less than 30 minutes. Staff was super friendly and professional.",
    image: "/home/people-like-repair/iPhone-17.jpg",
    rating: 5,
  },
  {
    name: "Sarah K.",
    service: "Dell Chromebook Repair",
    review:
      "Chromebook screen was cracked badly. They fixed it perfectly — looks brand new. Fast, affordable, and honest pricing.",
    image: "/home/people-like-repair/chrome-book.jpg",
    rating: 5,
  },
  {
    name: "Daniel M.",
    service: "Google Pixel 7 Pro Repair",
    review:
      "Went above and beyond to source the part from another store. Phone was ready exactly when promised. Highly recommend!",
    image: "/home/people-like-repair/google-pixel-7.jpg",
    rating: 5,
  },
  {
    name: "Zara T.",
    service: "Samsung Galaxy Repair",
    review:
      "Dropped my Galaxy and shattered the screen. Fixed in under an hour at a great price. Will definitely come back!",
    image: "/home/people-like-repair/Samsung-galaxy.jpg",
    rating: 5,
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function PeopleReviews() {
  return (
    <section className="w-full bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
            Customer reviews
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            People like our repairs.{" "}
            <span className="text-primary">A lot.</span>
          </h2>
          <p className="mt-3 text-gray-500 text-base max-w-xl">
            Don&apos;t just take our word for it — here&apos;s what our
            customers have to say.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="group relative rounded-2xl overflow-hidden"
            >
              {/* Full image */}
              <div className="relative w-full h-[420px]">
                <Image
                  src={r.image}
                  alt={r.service}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/50" />
              </div>

              {/* Review box — glassmorphism overlay at bottom */}
              <div className="absolute bottom-4 left-3 right-3 rounded-xl p-4 backdrop-blur-md bg-white/20 border border-white/30 shadow-lg">
                <Stars />
                <p className="mt-2 text-sm text-white leading-relaxed line-clamp-3 drop-shadow">
                  {r.review}
                </p>
                <div className="mt-3 pt-3 border-t border-white/30">
                  <p className="text-sm font-semibold text-white drop-shadow">{r.name}</p>
                  <p className="text-xs text-white/70 mt-0.5">{r.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
