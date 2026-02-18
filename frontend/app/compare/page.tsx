"use client";
import { useState } from "react";

export default function ComparePage() {
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
      setError("Failed to fetch deals.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-50 flex flex-col items-center p-8">
      {/* Floating Graphics */}
      <div className="absolute -z-10 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-5 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-bounce-slow" />
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-pink-300 rounded-full opacity-20 animate-spin-slow" />
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-purple-300 rounded-full opacity-25 animate-bounce-slow" />
      </div>

      <h1 className="text-5xl font-extrabold text-blue-700 mb-6 text-center">
        DealMatrix
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
        Discover the best deals on products instantly. Powered by eBay API for real-time prices, ratings, and reviews.
      </p>

      {/* Search Bar */}
      <div className="flex justify-center mb-6 flex-wrap gap-2">
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Enter product name..."
          className="border rounded-l-lg p-3 w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={fetchComparison}
          className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition"
        >
          Search Deals
        </button>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center text-gray-600 animate-pulse mb-6">
          Fetching deals...
        </div>
      )}
      {error && <p className="text-center text-red-600 mb-6">{error}</p>}

      {/* Results */}
      {results && (
        <div className="max-w-3xl w-full bg-white shadow-2xl rounded-lg p-6 relative z-10">
          {/* Best Option */}
          {results.best_option && (
            <div className="mb-6 p-4 border-l-4 border-green-500 bg-green-50 rounded">
              <h2 className="text-2xl font-bold text-green-700 mb-2">Top Deal</h2>
              <p className="font-semibold">
                {results.best_option.site} — {results.best_option.price}
              </p>
              {results.best_option.rating && (
                <p className="text-yellow-600">
                  Rating: {results.best_option.rating} ⭐
                </p>
              )}
              {results.best_option.reviews && (
                <p className="text-gray-500">{results.best_option.reviews} reviews</p>
              )}
              {results.best_option.link && (
                <a
                  href={results.best_option.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Deal
                </a>
              )}
            </div>
          )}

          {/* All Results */}
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Other Deals</h2>
          <ul className="divide-y divide-gray-200">
            {Array.isArray(results.all_results) &&
              results.all_results.map((r: any, i: number) => (
                <li key={i} className="py-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{r.site}</span>
                    <span>{r.price || r.error}</span>
                  </div>
                  {r.title && <p className="text-gray-600">{r.title}</p>}
                  {r.rating && <p className="text-yellow-600">Rating: {r.rating} ⭐</p>}
                  {r.reviews && <p className="text-gray-500">{r.reviews} reviews</p>}
                  {r.link && (
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Deal
                    </a>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        .animate-bounce-slow {
          animation: bounce 10s infinite alternate;
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
