"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* Background Gradients & Shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 opacity-30 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 opacity-20 rounded-full animate-spin-slow"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-200 opacity-25 rounded-full animate-bounce-slow"></div>
      </div>

      {/* Logo / Site Name */}
      <h1 className="text-6xl font-extrabold text-purple-700 mb-6 text-center animate-fade-in">
        MoolyaSetu
      </h1>

      {/* Tagline */}
      <p className="text-lg text-gray-700 mb-10 text-center max-w-xl animate-fade-in delay-200">
        Smart shopping alerts and Nirṇaya product comparisons. Track prices, reviews, ratings, and discover the best deals across eBay.
      </p>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-6 justify-center animate-fade-in delay-400">
        <Link
          href="/compare"
          className="bg-purple-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-purple-700 transition transform hover:-translate-y-1 hover:scale-105"
        >
          Nirṇaya (Compare Products)
        </Link>
        <Link
          href="/alerts"
          className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-green-700 transition transform hover:-translate-y-1 hover:scale-105"
        >
          Manage Alerts
        </Link>
        <Link
          href="/dashboard"
          className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 hover:scale-105"
        >
          Dashboard
        </Link>
      </div>

      {/* Footer Shapes */}
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-yellow-200 opacity-20 rounded-full animate-bounce-slow"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-300 opacity-15 rounded-full animate-spin-slow"></div>
    </main>
  );
}
