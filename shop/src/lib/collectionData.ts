// ── Types ──────────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  colors: string[];
  image: string;
  badge?: "New" | "Sale" | "Best Seller" | "Top Rated" | "Limited";
  inStock: boolean;
  slug: string;
  description?: string;
  specifications?: { key: string; value: string }[];
  variantImages?: string[];
}

export interface CollectionMeta {
  title: string;
  description: string;
  accent: string;
}

// ── Collection metadata (no products — all products are in MongoDB) ─────────────

export const COLLECTIONS: Record<string, CollectionMeta> = {
  audio:              { title: "Audio",            description: "Premium sound for every lifestyle — earbuds, over-ear, gaming, and more.",          accent: "from-violet-600 to-purple-700" },
  cases:              { title: "Cases",            description: "Every style, every device — slim, rugged, wallet, and MagSafe-ready.",               accent: "from-rose-500 to-pink-600"     },
  "screen-protection":{ title: "Screen Protection",description: "Tempered glass and film protectors for every screen size.",                          accent: "from-cyan-500 to-blue-600"     },
  power:              { title: "Power",            description: "Stay charged anywhere — cables, power banks, wireless pads, and car chargers.",       accent: "from-yellow-400 to-orange-500" },
  accessories:        { title: "Accessories",      description: "Grips, mounts, organizers, gaming gear, and every everyday essential.",               accent: "from-emerald-500 to-teal-600"  },
};

export const VALID_COLLECTION_SLUGS = Object.keys(COLLECTIONS);

// ── Color swatch map ───────────────────────────────────────────────────────────

export const COLOR_HEX: Record<string, string> = {
  Black:        "#111827",
  White:        "#F9FAFB",
  Navy:         "#1e3a5f",
  Gray:         "#9CA3AF",
  Silver:       "#D1D5DB",
  Blue:         "#3B82F6",
  Red:          "#EF4444",
  Pink:         "#EC4899",
  Green:        "#22C55E",
  Purple:       "#A855F7",
  Clear:        "transparent",
  "Multi-Color":"linear-gradient(135deg,#f00 0%,#0f0 50%,#00f 100%)",
  Graphite:     "#374151",
  Cream:        "#FEF3C7",
  Sand:         "#D4A96A",
  Midnight:     "#1C1C1E",
  Starlight:    "#F5F0E8",
  Teal:         "#14B8A6",
  Orange:       "#F97316",
  Brown:        "#92400E",
};

// ── Category ↔ slug maps ───────────────────────────────────────────────────────

export const CATEGORY_TO_SLUG: Record<string, string> = {
  Audio:              "audio",
  Cases:              "cases",
  "Screen Protection":"screen-protection",
  Power:              "power",
  Accessories:        "accessories",
};

export const SLUG_TO_CATEGORY: Record<string, string> = {
  audio:              "Audio",
  cases:              "Cases",
  "screen-protection":"Screen Protection",
  power:              "Power",
  accessories:        "Accessories",
};
