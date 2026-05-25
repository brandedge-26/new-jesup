import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COLLECTIONS, CATEGORY_TO_SLUG, type Product } from "@/lib/collectionData";
import ProductDetail from "./ProductDetail";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5510/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${API}/products/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const bp = await res.json();
      const desc = bp.description
        ?? `Shop ${bp.name}${bp.brand ? ` by ${bp.brand}` : ""}. $${Number(bp.price).toFixed(2)}. Free shipping & 30-day returns.`;
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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const [productRes, relatedRes] = await Promise.all([
      fetch(`${API}/products/${slug}`, { cache: "no-store" }),
      // will fetch after we know the category
      Promise.resolve(null),
    ]);

    if (productRes.ok) {
      const bp = await productRes.json();
      const colorVariant = bp.variants?.find((v: { name: string }) => v.name.toLowerCase() === "color");
      const colors: string[] = colorVariant?.options?.map((o: { label: string }) => o.label) ?? [];

      const product: Product = {
        id:            bp._id,
        name:          bp.name,
        brand:         bp.brand ?? "",
        price:         bp.price,
        originalPrice: bp.originalPrice,
        rating:        bp.rating ?? 4.5,
        reviews:       bp.reviews ?? 0,
        colors,
        image:         bp.image ?? "",
        badge:         bp.badge as Product["badge"],
        inStock:       bp.inStock ?? true,
        slug:          bp.slug || bp._id,
        description:   bp.description || undefined,
        specifications: bp.specifications?.length ? bp.specifications : undefined,
        variantImages:  bp.variantImages?.filter(Boolean).length ? bp.variantImages.filter(Boolean) : undefined,
      };

      const collectionId   = CATEGORY_TO_SLUG[bp.category] ?? "audio";
      const collectionMeta = COLLECTIONS[collectionId];

      // Fetch related products from same category
      let related: Product[] = [];
      try {
        const rRes = await fetch(
          `${API}/products?category=${encodeURIComponent(bp.category)}&status=Active&limit=5`,
          { cache: "no-store" }
        );
        if (rRes.ok) {
          const rData = await rRes.json();
          related = (rData.products as Record<string, unknown>[])
            .filter((p) => String(p._id) !== String(bp._id))
            .slice(0, 4)
            .map((p) => ({
              id:            String(p._id),
              name:          p.name as string,
              brand:         (p.brand as string) ?? "",
              price:         p.price as number,
              originalPrice: (p.originalPrice as number) ?? undefined,
              rating:        (p.rating as number) ?? 4.5,
              reviews:       (p.reviews as number) ?? 0,
              colors:        (p.colors as string[]) ?? [],
              image:         (p.image as string) ?? "",
              badge:         (p.badge as Product["badge"]) ?? undefined,
              inStock:       (p.inStock as boolean) ?? true,
              slug:          (p.slug as string) || String(p._id),
            }));
        }
      } catch { /* no related products */ }

      return (
        <>
          <Header />
          <main className="flex-1 bg-white">
            <ProductDetail
              product={product}
              collectionId={collectionId}
              collectionTitle={collectionMeta.title}
              related={related}
            />
          </main>
          <Footer />
        </>
      );
    }
  } catch { /* fall through */ }

  notFound();
}
