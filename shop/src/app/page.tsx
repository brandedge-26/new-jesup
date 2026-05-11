import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-xl mx-4 lg:mx-6 xl:mx-10 mt-6">
          {/* Desktop banner */}
          <Image
            src="/home/banner/banner.webp"
            alt="Galaxy S26 gear is here"
            width={1400}
            height={540}
            className="w-full object-cover hidden md:block"
            priority
          />
          {/* Mobile banner */}
          <Image
            src="/home/banner/mobile-banner.webp"
            alt="Galaxy S26 gear is here"
            width={600}
            height={600}
            className="w-full object-cover block md:hidden"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-16">
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-xs lg:max-w-sm">
              Galaxy S26 gear is here
            </h1>
            <p className="mt-3 text-sm lg:text-base text-gray-700 max-w-xs">
              Buying the new Samsung Galaxy® S26? You&apos;ll need some expert-approved accessories too.
            </p>
            <Link
              href="#"
              className="mt-6 inline-flex items-center justify-center px-7 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-colors w-fit text-sm lg:text-base"
            >
              Shop Now
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
