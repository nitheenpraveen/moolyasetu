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
    setResults(null);
    try {
      const res = await fetch(`/api/compare?product=${encodeURIComponent(product)}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setError("Failed to fetch eBay results.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-8 relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-50">
      {/* Animated background shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300 opacity-30 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 opacity-20 rounded-full animate-spin-slow"></div>
      </div>

      <h1 className="text-5xl font-extrabold text-center text-purple-700 mb-6">
        Nirṇaya
      </h1>
      <p className="text-center text-gray-700 mb-8 max-w-xl mx-auto">
        Compare products smartly. Discover the best eBay deals with live prices, ratings, and reviews.
      </p>

      {/* Search bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Enter product name..."
          className="border rounded-l-lg p-3 w-80 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={fetchComparison}
          className="bg-purple-600 text-white px-6 py-3 rounded-r-lg hover:bg-purple-700 transition"
        >
          Search
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-600 animate-pulse">
          Fetching eBay results...
        </p>
      )}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Results */}
      {results && (
        <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-lg p-6 mt-6">
          {/* Best Option */}
          {results.best_option && (
            <div className="mb-6 p-4 border-l-4 border-green-500 bg-green-50 rounded animate-fade-in">
              <h2 className="text-2xl font-bold text-green-700 mb-2">Top Pick</h2>
              <p className="font-semibold">{results.best_option.title}</p>
              <p>{results.best_option.price}</p>
              {results.best_option.rating && <p className="text-yellow-600">Rating: {results.best_option.rating} ⭐</p>}
              {results.best_option.reviews && <p className="text-gray-500">{results.best_option.reviews} reviews</p>}
              {results.best_option.link && (
                <a
                  href={results.best_option.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  View Product
                </a>
              )}
            </div>
          )}

          {/* All Results */}
          <h2 className="text-2xl font-bold text-gray-700 mb-4">All Results</h2>
          <ul className="divide-y divide-gray-200">
            {Array.isArray(results.all_results) &&
              results.all_results.map((r: any, i: number) => (
                <li key={i} className="py-3 animate-fade-in">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{r.title}</span>
                    <span>{r.price}</span>
                  </div>
                  {r.rating && <p className="text-yellow-600">Rating: {r.rating} ⭐</p>}
                  {r.reviews && <p className="text-gray-500">{r.reviews} reviews</p>}
                  {r.link && (
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline text-sm"
                    >
                      View Product
                    </a>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
