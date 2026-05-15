import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { findProduct, allProductSlugs, COLLECTIONS } from "@/lib/collectionData";
import ProductDetail from "./ProductDetail";

export async function generateStaticParams() {
  return allProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = findProduct(slug);
  if (!result) return {};
  const { product, collectionId } = result;
  const col = COLLECTIONS[collectionId];
  return {
    title: product.name,
    description: `Shop ${product.name} by ${product.brand}. Rated ${product.rating}/5 by ${product.reviews.toLocaleString()} customers. ${col.description}`,
    openGraph: {
      title: `${product.name} | Jesup Shop`,
      description: `${product.name} by ${product.brand} — $${product.price.toFixed(2)}. Free shipping & 30-day returns.`,
      url: `/products/${slug}`,
      images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = findProduct(slug);
  if (!result) notFound();

  const { product, collectionId } = result;
  const collection = COLLECTIONS[collectionId];
  const related = collection.products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <ProductDetail
          product={product}
          collectionId={collectionId}
          collectionTitle={collection.title}
          related={related}
        />
      </main>
      <Footer />
    </>
  );
}
