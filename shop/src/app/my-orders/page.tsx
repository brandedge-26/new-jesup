import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrdersClient from "./OrdersClient";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View and track your Jesup Shop orders.",
};

export default function MyOrdersPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 min-h-screen">
        <OrdersClient />
      </main>
      <Footer />
    </>
  );
}
