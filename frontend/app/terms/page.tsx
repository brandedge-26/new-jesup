import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Jesup Wireless",
};

const sections = [
  {
    title: "Acceptance of Terms",
    body: "By accessing or using the jesupwireless.com website and any services offered by Jesup Wireless, Inc. (\"Jesup,\" \"we,\" \"us,\" or \"our\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.",
  },
  {
    title: "Services",
    body: "Jesup Wireless provides mail-in device repair services for smartphones, tablets, computers, and gaming consoles. By submitting a repair request, you authorize Jesup technicians to inspect, diagnose, and repair your device as described in your service order.",
  },
  {
    title: "Repair Estimates & Authorization",
    body: "All repair quotes are estimates. We will contact you with a final price before beginning any work. Repair work will only proceed upon your verbal or written approval. You may decline the repair at any time before work begins; however, a diagnostic fee may apply.",
  },
  {
    title: "Device Shipping & Liability",
    body: "You are responsible for safely packaging your device for shipment. Jesup is not liable for damage that occurs during transit to our facility. We will ship repaired devices back using insured carrier services. Risk of loss during return shipment passes to you upon carrier pickup.",
  },
  {
    title: "Warranty",
    body: "All repairs performed by Jesup Wireless carry a 90-day warranty covering parts and labor for the specific issue repaired. This warranty does not cover new damage, liquid damage, or issues unrelated to the original repair. Warranty service must be requested within the 90-day period.",
  },
  {
    title: "Data & Privacy",
    body: "Jesup is not responsible for any loss of data that occurs during the repair process. We strongly recommend backing up your device before shipping it to us. By using our services, you also agree to our Privacy Policy, which is incorporated into these Terms by reference.",
  },
  {
    title: "Unclaimed Devices",
    body: "If a repaired device is not claimed within 30 days of notification, or if you decline the repair and do not arrange return shipping within 14 days, Jesup reserves the right to dispose of the device in accordance with applicable law.",
  },
  {
    title: "Intellectual Property",
    body: "All content on jesupwireless.com — including text, graphics, logos, images, and software — is the property of Jesup Wireless, Inc. and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.",
  },
  {
    title: "Limitation of Liability",
    body: "To the fullest extent permitted by law, Jesup Wireless, Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services. Our total liability for any claim related to a repair shall not exceed the amount you paid for that repair.",
  },
  {
    title: "Governing Law",
    body: "These Terms of Service shall be governed by and construed in accordance with the laws of the State of Georgia, without regard to its conflict of law provisions. Any disputes arising under these terms shall be resolved in the courts located in Georgia.",
  },
  {
    title: "Changes to These Terms",
    body: "We reserve the right to update or modify these Terms of Service at any time. Changes will be posted on this page with an updated effective date. Continued use of our website or services after changes are posted constitutes your acceptance of the revised terms.",
  },
  {
    title: "Contact Us",
    body: "If you have any questions about these Terms of Service, please contact us at support@jesupwireless.com or by calling 1-800-JESUP-FIX.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-gray-950 px-6 lg:px-16 2xl:px-24 py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">Terms of Service</h1>
          <p className="text-gray-400 text-sm">
            Jesup Wireless, Inc. &nbsp;·&nbsp; Effective as of January 1, 2024
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 lg:px-16 2xl:px-24 py-14">
        <div className="max-w-3xl">

          {/* Intro */}
          <p className="text-gray-600 text-sm leading-relaxed mb-10">
            Please read these Terms of Service carefully before using{" "}
            <a href="https://www.jesupwireless.com" className="text-primary hover:text-primary-hover underline underline-offset-2">
              jesupwireless.com
            </a>{" "}
            or submitting a repair request. These terms form a legally binding agreement between you and Jesup Wireless, Inc.
          </p>

          {/* Sections */}
          <div className="flex flex-col gap-10">
            {sections.map((s, i) => (
              <div key={s.title}>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  <span className="text-primary mr-2">{i + 1}.</span>
                  {s.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-14 rounded-2xl bg-gray-50 border border-gray-100 px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">Questions about these terms?</p>
              <p className="text-gray-500 text-sm">Reach out and we&apos;ll be happy to clarify anything.</p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors shrink-0"
            >
              Contact us
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
