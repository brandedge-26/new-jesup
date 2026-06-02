import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";
import CollectionView from "./CollectionView";
import { COLLECTIONS, VALID_COLLECTION_SLUGS } from "@/lib/collectionData";

export async function generateStaticParams() {
  return VALID_COLLECTION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const col = COLLECTIONS[slug];
  if (!col) return {};
  return {
    title: `${col.title} — Shop ${col.title} Accessories`,
    description: `${col.description} Free fast shipping. 30-day returns. Expert-curated picks at Jesup Shop.`,
    openGraph: {
      title: `${col.title} | Jesup Shop`,
      description: col.description,
      url: `/collections/${slug}`,
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!VALID_COLLECTION_SLUGS.includes(slug)) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <Suspense fallback={null}>
          <CollectionView slug={slug} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
