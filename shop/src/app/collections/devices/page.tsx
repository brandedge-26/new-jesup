import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DevicesView from "./DevicesView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop by Device — iPhone & Samsung Accessories",
  description: "Find the perfect case, screen protector, charger, and more for your iPhone or Samsung Galaxy. Browse accessories by device model at Jesup Shop.",
  openGraph: {
    title: "Shop by Device | Jesup Shop",
    description: "Accessories for every iPhone and Samsung Galaxy model.",
    url: "/collections/devices",
  },
};

export default function DevicesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Hero */}
        <section className="bg-white border-b border-gray-100 px-4 py-10 lg:py-14">
          <div className="max-w-screen-xl mx-auto">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1 mb-4">
              Shop by Device
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Find Accessories for Your Device
            </h1>
            <p className="mt-3 text-gray-500 text-base max-w-lg">
              Browse cases, screen protectors, chargers and more — all matched to your exact iPhone or Samsung model.
            </p>
          </div>
        </section>

        <Suspense fallback={null}>
          <DevicesView />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
