import type { MetadataRoute } from "next";
import { VALID_COLLECTION_SLUGS } from "@/lib/collectionData";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jesupwireless.com";
const API  = process.env.NEXT_PUBLIC_API_URL;

// Static pages with their priority and change frequency
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE,                              priority: 1.0,  changeFrequency: "daily"   },
  { url: `${BASE}/collections`,             priority: 0.9,  changeFrequency: "daily"   },
  { url: `${BASE}/new-arrivals`,            priority: 0.8,  changeFrequency: "daily"   },
  { url: `${BASE}/trending`,                priority: 0.8,  changeFrequency: "daily"   },
  { url: `${BASE}/start-repair`,            priority: 0.8,  changeFrequency: "monthly" },
  { url: `${BASE}/faq`,                     priority: 0.5,  changeFrequency: "monthly" },
  { url: `${BASE}/contact`,                 priority: 0.5,  changeFrequency: "monthly" },
  { url: `${BASE}/privacy`,                 priority: 0.3,  changeFrequency: "yearly"  },
  { url: `${BASE}/terms`,                   priority: 0.3,  changeFrequency: "yearly"  },
];

// Collection pages
const COLLECTION_ROUTES: MetadataRoute.Sitemap = VALID_COLLECTION_SLUGS.map((slug) => ({
  url: `${BASE}/collections/${slug}`,
  priority: 0.85,
  changeFrequency: "daily" as const,
}));

// Fetch all product slugs from API
async function getProductRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    let page = 1;
    const slugs: string[] = [];

    while (true) {
      const res = await fetch(
        `${API}/products?page=${page}&limit=100&status=Active`,
        { next: { revalidate: 3600 } } // revalidate every hour
      );
      if (!res.ok) break;

      const data = await res.json();
      const products: { slug?: string; _id: string; updatedAt?: string }[] = data.products ?? [];
      if (products.length === 0) break;

      for (const p of products) {
        const slug = p.slug ?? p._id;
        slugs.push(slug);
      }

      if (page >= (data.totalPages ?? 1)) break;
      page++;
    }

    return slugs.map((slug) => ({
      url: `${BASE}/products/${slug}`,
      priority: 0.75,
      changeFrequency: "weekly" as const,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productRoutes = await getProductRoutes();

  return [
    ...STATIC_ROUTES,
    ...COLLECTION_ROUTES,
    ...productRoutes,
  ];
}
