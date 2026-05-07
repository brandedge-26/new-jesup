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
      "Not sure what's wrong? Send it in — we'll inspect your device at no charge and tell you exactly what it needs. We also offer ",
    link: { label: "advanced troubleshooting", modal: "diagnostics" },
    suffix: " for complex issues.",
  },
  {
    icon: PiggyBank,
    title: "Price match guarantee",
    description:
      "Found a lower repair price somewhere else? Show us and we'll match it and beat it by $5. ",
    link: { label: "See how it works", modal: "price" },
    suffix: ".",
  },
  {
    icon: Zap,
    title: "Fast turnaround",
    description:
      "Most mail-in repairs are completed within 1–2 business days of arrival. We move fast so you're not stuck without your device.",
    link: null,
    suffix: "",
  },
  {
    icon: BadgeCheck,
    title: "90-day repair warranty",
    description: "Every repair ships back with our ",
    link: { label: "90-day warranty", modal: "warranty" },
    suffix: ". If the same issue comes back, we fix it free — no questions asked.",
  },
];

function DiagnosticsModal() {
  return (
    <>
      <p>
        Not sure what&apos;s broken? No problem. Every device we receive gets a
        free visual and functional diagnostic. We&apos;ll tell you what&apos;s
        wrong and what it&apos;ll cost to fix — before we touch anything.
      </p>
      <p>
        For harder-to-diagnose issues, we offer advanced troubleshooting¹ — a
        deeper teardown and component-level inspection. A small fee² applies, but
        it&apos;s credited toward your repair if you choose to proceed. You&apos;re
        never obligated to approve the repair.
      </p>
      <div className="border-t border-gray-100 pt-4 space-y-1 text-xs text-gray-400">
        <p>¹ Advanced troubleshooting availability may vary. Contact us to confirm.</p>
        <p>² Advanced troubleshooting fees are non-refundable if no repair is authorized.</p>
      </div>
    </>
  );
}

function PriceModal() {
  return (
    <>
      <p>
        We want to offer the best repair value, period. If you find a lower
        published price for the same repair at a local competitor, bring it to
        us and we&apos;ll match it — then beat it by $5.
      </p>
      <p>
        The competing price must be a standard, published rate — not a
        temporary promotion, coupon, or bundle deal.
      </p>
      <p>
        <strong className="text-gray-800">How to redeem:</strong> Mention the
        price match before your repair order is confirmed. Once the order is
        finalized, the price is locked in.
      </p>
      <div>
        <p className="font-semibold text-gray-800 mb-2">Eligibility requirements:</p>
        <ul className="list-disc list-inside space-y-1.5 text-gray-500">
          <li>Must be for an identical repair service listed on our website.</li>
          <li>Competitor must be a local, brick-and-mortar repair shop.</li>
          <li>We reserve the right to verify the quoted price before matching.</li>
          <li>One price match per customer, per repair, per order.</li>
        </ul>
      </div>
      <div>
        <p className="font-semibold text-gray-800 mb-2">Does not apply to:</p>
        <ul className="list-disc list-inside space-y-1.5 text-gray-500">
          <li>Online-only shops or mobile repair vans without a physical location.</li>
          <li>Flash sales, limited-time offers, or membership-based pricing.</li>
          <li>Repairs using used, refurbished, or aftermarket components.</li>
          <li>Bundle offers, trade-in credits, or financing promotions.</li>
        </ul>
      </div>
    </>
  );
}

function WarrantyModal() {
  return (
    <p>
      Every repair completed by Jesup Wireless comes with a 90-day limited
      warranty. If the same issue reoccurs within 90 days of your repair, we
      will fix it at no additional charge. Exceptions include liquid damage
      repairs, physical damage caused after the repair, and devices covered
      under a separate manufacturer or insurance plan.
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
    title: "Price Match Guarantee",
    content: <PriceModal />,
  },
  warranty: {
    title: "90-Day Repair Warranty",
    content: <WarrantyModal />,
  },
};

export default function SmallServices() {
  const [activeModal, setActiveModal] = useState<ModalKey>(null);

  const current = activeModal ? modalContent[activeModal] : null;

  return (
    <>
      <section className="w-full bg-white py-14 lg:py-16 border-b border-gray-100">
        <div className="px-6 lg:px-10 2xl:px-16">
          {/* Heading */}
          <div className="mb-10">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
              Our promise
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Quality repairs, zero compromises
            </h2>
            <p className="mt-3 text-gray-500 text-base max-w-xl">
              Every device we touch is handled with care — honest pricing, skilled
              technicians, and a warranty you can actually count on.
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
