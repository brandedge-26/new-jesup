import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Clock, CalendarCheck, ChevronRight, CheckCircle2,
  AlertTriangle, Lightbulb, ListChecks, ArrowLeft,
} from "lucide-react";
import { allGuides, generateStaticParams, type Section } from "./guideContent";

export { generateStaticParams };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = allGuides[slug];
  if (!guide) return {};
  return {
    title: `${guide.title} | Jesup Repair Guides`,
    description: guide.excerpt,
  };
}

const categoryColor: Record<string, string> = {
  iPhone:   "bg-blue-50 text-blue-600",
  Samsung:  "bg-indigo-50 text-indigo-600",
  Phone:    "bg-violet-50 text-violet-600",
  Tablet:   "bg-teal-50 text-teal-600",
  Computer: "bg-orange-50 text-orange-600",
  Gaming:   "bg-green-50 text-green-600",
  General:  "bg-primary/8 text-primary",
};

function RenderSection({ section }: { section: Section }) {
  switch (section.type) {
    case "paragraph":
      return (
        <p className="text-gray-600 leading-relaxed text-[15px]">{section.text}</p>
      );

    case "heading":
      return (
        <h2 className="text-xl font-bold text-gray-900 mt-2">{section.text}</h2>
      );

    case "tip":
      return (
        <div className="flex gap-4 bg-primary/6 border border-primary/20 rounded-2xl p-5">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-4.5 h-4.5 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-bold text-primary text-sm mb-1">{section.title}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{section.text}</p>
          </div>
        </div>
      );

    case "warning":
      return (
        <div className="flex gap-4 bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-4.5 h-4.5 text-red-500" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-bold text-red-700 text-sm mb-1">{section.title}</p>
            <p className="text-sm text-red-600 leading-relaxed">{section.text}</p>
          </div>
        </div>
      );

    case "steps":
      return (
        <div className="space-y-4">
          {section.items.map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="pt-0.5">
                <p className="font-bold text-gray-900 text-sm mb-1">{item.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      );

    case "list":
      return (
        <ul className="space-y-2.5">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2} />
              {item}
            </li>
          ))}
        </ul>
      );

    default:
      return null;
  }
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = allGuides[slug];
  if (!guide) notFound();

  const related = guide.relatedSlugs
    .map((s) => allGuides[s])
    .filter(Boolean)
    .slice(0, 3);

  const badgeColor = categoryColor[guide.category] ?? "bg-gray-100 text-gray-600";

  return (
    <main className="flex-1 bg-white">

      {/* ════════════ HERO IMAGE ════════════ */}
      <div className="relative h-64 lg:h-[420px] w-full overflow-hidden bg-gray-100">
        <Image
          src={guide.image}
          alt={guide.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-6 lg:px-10 pb-10">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${badgeColor}`}>
            {guide.category}
          </span>
          <h1 className="text-2xl lg:text-4xl font-extrabold text-white leading-tight mb-3">
            {guide.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {guide.readTime}
            </span>
            <span>By {guide.author}</span>
          </div>
        </div>
      </div>

      {/* ════════════ ARTICLE BODY ════════════ */}
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12">

        {/* back link */}
        <Link
          href="/repair-guides"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all guides
        </Link>

        {/* excerpt */}
        <p className="text-lg text-gray-500 leading-relaxed border-l-4 border-primary pl-5 mb-10">
          {guide.excerpt}
        </p>

        {/* sections */}
        <div className="space-y-7">
          {guide.sections.map((section, i) => (
            <RenderSection key={i} section={section} />
          ))}
        </div>

        {/* inline CTA */}
        <div className="mt-14 bg-primary rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-extrabold text-lg mb-1">Rather let the experts handle it?</p>
            <p className="text-white/75 text-sm">Free diagnostic, no obligation. Walk in today.</p>
          </div>
          <Link
            href="/appointments"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-bold text-sm hover:bg-gray-100 transition-colors"
          >
            <CalendarCheck className="w-4 h-4" />
            Schedule a repair
          </Link>
        </div>
      </div>

      {/* ════════════ RELATED GUIDES ════════════ */}
      {related.length > 0 && (
        <section className="border-t border-gray-100 py-14 px-6 lg:px-10 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <ListChecks className="w-4 h-4 text-primary" />
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Related guides</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/repair-guides/${r.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col"
                >
                  <div className="relative h-32 overflow-hidden">
                    <Image src={r.image} alt={r.title} fill className="object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-xs font-semibold text-primary mb-1">{r.category}</p>
                    <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors flex-1">
                      {r.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-3 text-xs text-primary font-bold">
                      Read <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
