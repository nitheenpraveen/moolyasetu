import } from "next";
.css";
import Navbar from "@components Footer from "@components type { Metadataimport "./globals/Navbar";
import/Footer";

export Metadata = {
  title: "MoolyaSetu – Bridge instantly across const metadata: of Value",
  description: "Compare deals, and eBay with M Amazon, FlipkartoolyaSetu.",
};

export default function RootLayout({
  children,
}: {
  children;
}) {
  return (
: React.ReactNode    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
