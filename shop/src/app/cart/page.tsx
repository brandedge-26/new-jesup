import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartPage from "./CartPage";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your selected items and proceed to checkout at Jesup Shop.",
};

export default function Cart() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 min-h-screen">
        <CartPage />
      </main>
      <Footer />
    </>
  );
}
