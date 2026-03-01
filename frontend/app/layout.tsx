import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

export const metadata: Metadata = {
  title: "MoolyaSetu – Bridge of Value",
  description: "Compare deals instantly across Amazon, Flipkart, and eBay with MoolyaSetu."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
