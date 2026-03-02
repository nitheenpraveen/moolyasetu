import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoolyaSetu | The Bridge of Value",
  description: "AI-powered shopping comparison for the best deals.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-900`}>
        <div className="min-h-screen flex flex-col">
          {/* We will build the Navbar and Footer next */}
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
