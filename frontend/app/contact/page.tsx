"use client";

import { useState } from "react";
import { Mail, Phone, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { publicAxios } from "@/lib/axios";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", message: "",
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);
    try {
      await publicAxios.post("/contacts", form);
      setSubmitted(true);
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all";

  return (
    <div className="min-h-screen bg-white">

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">

        {/* ── Left — Form ── */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 2xl:px-24 py-16">
          <div className="max-w-lg w-full">

            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
              Contact us
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
              Send us a message
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-10">
              Fill out the form and our team will get back to you within 24 hours.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Message sent!</h2>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setApiError(""); setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" }); }}
                  className="mt-2 text-sm text-primary underline underline-offset-2 hover:text-primary-hover transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                {apiError && (
                  <div className="mb-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                    {apiError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ali"
                      value={form.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Khan"
                      value={form.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ali@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputCls}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={inputCls}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full py-3.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : "Send Message →"}
                </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* ── Right — Info panel (bg-gray-950) ── */}
        <div className="lg:w-[420px] xl:w-[480px] shrink-0 bg-gray-950 flex flex-col justify-center px-10 xl:px-16 py-16">
          <div className="max-w-sm">

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
              Our experts are waiting
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10">
              We&apos;re available{" "}
              <span className="text-white font-semibold">Mon–Fri, 9am–6pm CST</span>{" "}
              and can route you to the right place.
            </p>

            {/* Contact options */}
            <div className="flex flex-col gap-4 mb-12">
              <a
                href="tel:18005378349"
                className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Call us</p>
                  <p className="text-sm font-semibold text-white">1-800-JESUP-FIX</p>
                </div>
              </a>

              <a
                href="mailto:support@jesupwireless.com"
                className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Email us</p>
                  <p className="text-sm font-semibold text-white">support@jesupwireless.com</p>
                </div>
              </a>

              <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Hours</p>
                  <p className="text-sm font-semibold text-white">Mon–Fri, 9am–6pm CST</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 pt-8">
              <p className="text-xs text-gray-500 leading-relaxed">
                For repair status updates, check your email — we send updates at every stage of your repair.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
