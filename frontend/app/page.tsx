"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-blue-600 mb-6">MoolyaSetu</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
        Smart shopping alerts and product comparisons. Find the best prices, reviews, and quality across multiple Indian e-commerce platforms.
      </p>
      <div className="space-x-4">
        <Link href="/compare" className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition">
          Compare Products
        </Link>
        <Link href="/alerts" className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 transition">
          Manage Alerts
        </Link>
        <Link href="/dashboard" className="bg-purple-600 text-white px-6 py-3 rounded shadow hover:bg-purple-700 transition">
          Dashboard
        </Link>
      </div>
    </main>
  );
}
