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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
        Product Comparison
      </h1>

      {/* Search */}
      <div className="flex justify-center mb-8">
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
          Compare
        </button>
      </div>

      {loading && <p className="text-center text-gray-700 font-semibold">Fetching results...</p>}
      {error && <p className="text-center text-red-600 font-semibold">{error}</p>}

      {results && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Best Option */}
          {results.best_option && (
            <div className="bg-green-100 border-l-4 border-green-500 p-6 rounded shadow-md animate-fadeIn">
              <h2 className="text-2xl font-bold text-green-700 mb-3">Best Option</h2>
              <p className="text-lg">
                <span className="font-semibold">{results.best_option.site}</span> — {results.best_option.price}
              </p>
              {results.best_option.rating && <p className="text-yellow-600 text-sm">Rating: {results.best_option.rating} ⭐</p>}
              {results.best_option.reviews && <p className="text-gray-700 text-sm">{results.best_option.reviews} reviews</p>}
              {results.best_option.link && (
                <a href={results.best_option.link} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">
                  View Product
                </a>
              )}
            </div>
          )}

          {/* All Results */}
          <h2 className="text-2xl font-bold text-gray-800">All Results</h2>
          <ul className="space-y-4">
            {Array.isArray(results.all_results) &&
              results.all_results.map((r: any, i: number) => (
                <li key={i} className={`bg-white p-5 rounded-lg shadow-md transition hover:scale-105 hover:shadow-lg ${r.site === results.best_option?.site ? "border-2 border-green-500" : ""}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">{r.site}</span>
                    <span className="text-gray-700">{r.price || r.error}</span>
                  </div>
                  {r.title && <p className="text-gray-600 mb-1">{r.title}</p>}
                  {r.rating && <p className="text-yellow-600 text-sm mb-1">Rating: {r.rating} ⭐</p>}
                  {r.reviews && <p className="text-gray-500 text-sm mb-2">{r.reviews} reviews</p>}
                  {r.link && (
                    <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
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
