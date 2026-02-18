"use client";

import { useState } from "react";

export default function NirnayaPage() {
  const [product, setProduct] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchComparison() {
    if (!product) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/compare?product=${encodeURIComponent(product)}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setError("Failed to fetch comparison results.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-8 relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-50">
      {/* Banner image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1612831455541-0d1ad41a4c9d?auto=format&fit=crop&w=1920&q=80"
          alt="Shopping Banner"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <h1 className="text-5xl font-extrabold text-center text-blue-800 mb-6">
        Nirṇaya
      </h1>
      <p className="text-center text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
        Discover the best deals with real-time product comparisons and ratings. Powered by eBay Sandbox for now.
      </p>

      {/* Search bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Search your product..."
          className="w-80 p-3 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={fetchComparison}
          className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition"
        >
          🔍 Search
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center mb-6">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          <style>
            {`
              .loader {
                border-top-color: #3498db;
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* Results */}
      {results && (
        <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.all_results?.map((r: any, i: number) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between hover:scale-105 transition transform"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800">{r.site}</h2>
                <p className="text-gray-600">{r.title || "No product found"}</p>
                <p className="mt-1 text-green-700 font-semibold">{r.price || "N/A"}</p>
                {r.rating && <p className="text-yellow-600">Rating: {r.rating} ⭐</p>}
                {r.reviews && <p className="text-gray-500">{r.reviews} reviews</p>}
              </div>
              {r.link && (
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-blue-600 hover:underline font-medium"
                >
                  View Product
                </a>
              )}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
