"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-extrabold text-blue-600 mb-6 animate-pulse">
        MoolyaSetu
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
        Smart shopping alerts and product comparisons. Track prices in real-time
        across Amazon, Flipkart, eBay, Reliance Digital, TataCliq, and more.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/compare" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
          Compare Products
        </Link>
        <Link href="/alerts" className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition">
          Manage Alerts
        </Link>
        <Link href="/dashboard" className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition">
          Dashboard
        </Link>
      </div>
    </main>
  );
}
