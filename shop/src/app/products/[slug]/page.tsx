import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { findProduct, allProductSlugs, COLLECTIONS, type Product } from "@/lib/collectionData";
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
  if (result) {
    const { product, collectionId } = result;
    const col = COLLECTIONS[collectionId];
    return {
      title: `${product.name} | Jesup Shop`,
      description: `Shop ${product.name} by ${product.brand}. Rated ${product.rating}/5 by ${product.reviews.toLocaleString()} customers. ${col.description}`,
      openGraph: {
        title: `${product.name} | Jesup Shop`,
        description: `${product.name} by ${product.brand} — $${product.price.toFixed(2)}. Free shipping & 30-day returns.`,
        url: `/products/${slug}`,
        images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
      },
    };
  }
  // Try backend product
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5510/api";
    const res = await fetch(`${apiUrl}/products/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const bp = await res.json();
      const desc = bp.description
        ? bp.description
        : `Shop ${bp.name}${bp.brand ? ` by ${bp.brand}` : ""}. $${Number(bp.price).toFixed(2)}. Free shipping & 30-day returns.`;
      return {
        title: `${bp.name} | Jesup Shop`,
        description: desc,
        openGraph: {
          title: `${bp.name} | Jesup Shop`,
          description: desc,
          url: `/products/${slug}`,
          images: bp.image ? [{ url: bp.image, width: 800, height: 800, alt: bp.name }] : [],
        },
      };
    }
  } catch { /* fall through */ }
  return {};
}

const CATEGORY_TO_SLUG: Record<string, string> = {
  Audio:              "audio",
  Cases:              "cases",
  "Screen Protection":"screen-protection",
  Power:              "power",
  Accessories:        "accessories",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = findProduct(slug);

  // Static product found — render normally
  if (result) {
    const { product, collectionId } = result;
    const collection = COLLECTIONS[collectionId];
    const related = collection.products.filter((p) => p.id !== product.id).slice(0, 4);
    return (
      <>
        <Header />
        <main className="flex-1 bg-white">
          <ProductDetail product={product} collectionId={collectionId} collectionTitle={collection.title} related={related} />
        </main>
        <Footer />
      </>
    );
  }

  // Try fetching from backend by MongoDB _id
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5510/api";
    const res = await fetch(`${apiUrl}/products/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const bp = await res.json();
      const colorVariant = bp.variants?.find((v: { name: string }) => v.name.toLowerCase() === "color");
      const variantColors = colorVariant?.options?.map((o: { label: string }) => o.label) ?? [];
      const colors: string[] = (bp.colors && bp.colors.length > 0) ? bp.colors : variantColors;
      const product: Product = {
        id: bp._id, name: bp.name, brand: bp.brand ?? "",
        price: bp.price, originalPrice: bp.originalPrice,
        rating: bp.rating ?? 4.5, reviews: bp.reviews ?? 0,
        colors, image: bp.image ?? "",
        badge: bp.badge as Product["badge"],
        inStock: bp.inStock ?? true, slug: bp.slug || bp._id,
        description: bp.description || undefined,
        specifications: bp.specifications?.length ? bp.specifications : undefined,
        variantImages: bp.variantImages?.filter(Boolean).length ? bp.variantImages.filter(Boolean) : undefined,
      };
      const collectionId = CATEGORY_TO_SLUG[bp.category] ?? "audio";
      const collection = COLLECTIONS[collectionId];
      const related = collection.products.slice(0, 4);
      return (
        <>
          <Header />
          <main className="flex-1 bg-white">
            <ProductDetail product={product} collectionId={collectionId} collectionTitle={collection.title} related={related} />
          </main>
          <Footer />
        </>
      );
    }
  } catch { /* fall through */ }

  notFound();
}
