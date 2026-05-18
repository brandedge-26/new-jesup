import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WishlistClient from "./WishlistClient";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved items on Jesup Shop.",
};

export default function WishlistPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 min-h-screen">
        <WishlistClient />
      </main>
      <Footer />
    </>
  );
}
