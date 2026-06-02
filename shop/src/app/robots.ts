import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jesupwireless.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/cart",
          "/account",
          "/my-orders",
          "/wishlist",
          "/auth-success",
          "/auth-error",
          "/track-order",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
