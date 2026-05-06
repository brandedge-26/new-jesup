"use client";

import { useState } from "react";
import { Stethoscope, PiggyBank, Zap, BadgeCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Modal from "@/components/ui/Modal";

type ModalKey = "diagnostics" | "price" | "warranty" | null;

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  link: { label: string; modal: ModalKey } | null;
  suffix: string;
};

const services: Service[] = [
  {
    icon: Stethoscope,
    title: "Free diagnostics",
    description:
      "Yes, we'll check your tech at no cost. And if more is needed, we'll do ",
    link: { label: "advanced troubleshooting", modal: "diagnostics" },
    suffix: ".",
  },
  {
    icon: PiggyBank,
    title: "Low price guarantee",
    description:
      "We'll match a local competitor's price for the same repair and beat it by $5. ",
    link: { label: "Learn how", modal: "price" },
    suffix: ".",
  },
  {
    icon: Zap,
    title: "Same-day service",
    description:
      "Need your device back fast? Most of our repairs are done as soon as the same day.",
    link: null,
    suffix: "",
  },
  {
    icon: BadgeCheck,
    title: "1-year limited warranty",
    description: "Most repairs also come with our ",
    link: { label: "1-year limited warranty", modal: "warranty" },
    suffix: " and are valid at all 700+ locations.",
  },
];

function DiagnosticsModal() {
  return (
    <>
      <p>
        Not sure what&apos;s wrong with your device? Our experts provide a free
        diagnostic for every repair. And if we can&apos;t figure out the issue
        right away, we&apos;ll do advanced troubleshooting¹ on your device for
        a small fee². Don&apos;t worry, the fee will be applied towards your
        repair if you choose to move forward.
      </p>
      <p>
        <strong className="text-gray-800">Why the fee?</strong> It&apos;s
        simple. When our experts perform advanced troubleshooting, we&apos;ll
        need to carefully take your device apart and test different ways to fix
        the problem. It&apos;s a more in-depth and intensive analysis than our
        free diagnostic. We don&apos;t have to provide this service and will
        always let you know beforehand if your issue can&apos;t be diagnosed for
        free. And there&apos;s no obligation to get a repair — ever.
      </p>
      <div className="border-t border-gray-100 pt-4 space-y-1 text-xs text-gray-400">
        <p>¹ Advanced troubleshooting may not be available at all locations. See stores for details.</p>
        <p>² Advanced troubleshooting fees are non-refundable.</p>
      </div>
    </>
  );
}

function PriceModal() {
  return (
    <>
      <p>
        Our low price guarantee ensures that we always offer the best price to
        our customers. Just bring in any local competitor&apos;s published price
        for the same repair, and we will happily match and beat their price by
        $5.
      </p>
      <p>
        The repair price must be a regularly published price. This offer does
        not apply to competitor&apos;s specials, coupons, or other discounts.
      </p>
      <p>
        <strong className="text-gray-800">How to match a price:</strong> Just
        request the price match right at the register while checking in a device
        for repair. Once the work order is printed and signed, the price is not
        subject to change.
      </p>
      <div>
        <p className="font-semibold text-gray-800 mb-2">Guidelines &amp; limitations:</p>
        <ul className="list-disc list-inside space-y-1.5 text-gray-500">
          <li>Price matching is only available for repair services listed on our website.</li>
          <li>The price must be published by a local retailer with a brick-and-mortar store within 10 miles.</li>
          <li>We reserve the right to verify the price of identical, in-stock repair components.</li>
          <li>Limited to one-per-customer, per repair, per day.</li>
        </ul>
      </div>
      <div>
        <p className="font-semibold text-gray-800 mb-2">Does not apply to:</p>
        <ul className="list-disc list-inside space-y-1.5 text-gray-500">
          <li>Prices from auctions or retailers requiring memberships.</li>
          <li>Mobile repair providers without a brick-and-mortar store.</li>
          <li>Bundle offers, instant rebates, mail-in offers, or financing.</li>
          <li>Clearance, close-out, liquidation, or flash/limited-quantity offers.</li>
          <li>Prices using damaged or used components, or misprinted prices.</li>
        </ul>
      </div>
    </>
  );
}

function WarrantyModal() {
  return (
    <p>
      Our repairs come with a 1-year limited warranty, valid at all our
      locations. The only exceptions are liquid damage repairs or if we&apos;re
      working on your device through your Original Equipment Manufacturer
      warranty or some other coverage plan. Then the terms of that coverage
      would apply.
    </p>
  );
}

const modalContent: Record<
  NonNullable<ModalKey>,
  { title: string; content: React.ReactNode }
> = {
  diagnostics: {
    title: "Free Diagnostics",
    content: <DiagnosticsModal />,
  },
  price: {
    title: "Low Price Guarantee",
    content: <PriceModal />,
  },
  warranty: {
    title: "1-Year Limited Warranty",
    content: <WarrantyModal />,
  },
};

export default function SmallServices() {
  const [activeModal, setActiveModal] = useState<ModalKey>(null);

  const current = activeModal ? modalContent[activeModal] : null;

  return (
    <>
      <section className="w-full bg-white py-14 lg:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          {/* Heading */}
          <div className="mb-10">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
              Why choose us
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Repair you can count on
            </h2>
            <p className="mt-3 text-gray-500 text-base max-w-xl">
              Every repair comes with our promise — honest pricing, expert
              technicians, and service that puts you first.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s) => (
              <div
                key={s.title}
                className="group relative flex flex-col gap-4 p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Large icon as background placeholder */}
                <s.icon
                  size={100}
                  strokeWidth={1}
                  className="absolute -right-5 -bottom-4 text-gray-100 group-hover:text-primary/10 transition-colors duration-200"
                />

                {/* Small icon on top */}
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon size={22} strokeWidth={1.8} className="text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-gray-900">{s.title}</h3>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed relative z-10">
                  {s.description}
                  {s.link && (
                    <button
                      onClick={() => setActiveModal(s.link!.modal)}
                      className="text-primary underline underline-offset-2 hover:text-primary-hover transition-colors cursor-pointer"
                    >
                      {s.link.label}
                    </button>
                  )}
                  {s.suffix}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {current && (
        <Modal
          open={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={current.title}
        >
          {current.content}
        </Modal>
      )}
    </>
  );
}
