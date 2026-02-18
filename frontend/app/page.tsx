"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-blue-100 via-purple-200 to-pink-100 animate-gradient-x" />

      <h1 className="text-6xl font-extrabold text-blue-700 mb-6 text-center">
        MoolyaSetu
      </h1>
      <p className="text-lg text-gray-700 mb-10 text-center max-w-xl">
        Smart shopping alerts and product comparisons. Get real-time price tracking, reviews, ratings, and discover the best deals across top e-commerce platforms.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/compare"
          className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Compare Products
        </Link>
        <Link
          href="/alerts"
          className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-green-700 transition"
        >
          Manage Alerts
        </Link>
        <Link
          href="/dashboard"
          className="bg-purple-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-purple-700 transition"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}
