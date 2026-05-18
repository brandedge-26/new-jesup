import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Jesup Shop — Premium Phone Accessories",
    template: "%s | Jesup Shop",
  },
  description: "Shop premium phone cases, audio, screen protection, power accessories and more — curated by repair experts at Jesup.",
  keywords: ["phone cases", "screen protectors", "earbuds", "power banks", "phone accessories"],
  openGraph: {
    siteName: "Jesup Shop",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col"><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
