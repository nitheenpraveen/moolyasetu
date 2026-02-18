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
      setError("Failed to fetch results.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-8 relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-50">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">
        Nirṇaya
      </h1>

      {/* Search */}
      <div className="flex justify-center mb-6">
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
          Search
        </button>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
          <div className="h-16 bg-white rounded shadow" />
          <div className="h-16 bg-white rounded shadow" />
          <div className="h-16 bg-white rounded shadow" />
        </div>
      )}

      {/* Error */}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Results */}
      {results && (
        <div className="max-w-3xl mx-auto mt-6 space-y-4">
          {results.best_option && (
            <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
              <h2 className="text-2xl font-bold text-green-700 mb-2">Top Choice</h2>
              <p className="font-semibold">
                {results.best_option.title} — {results.best_option.price}
              </p>
              <p className="text-yellow-600">
                Rating: {results.best_option.rating} ⭐
              </p>
              <p className="text-gray-500">{results.best_option.reviews} reviews</p>
              <a
                href={results.best_option.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View on eBay
              </a>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-700 mt-4">All Results</h2>
          <ul className="divide-y divide-gray-200">
            {results.all_results.map((r: any, i: number) => (
              <li key={i} className="py-3">
                <div className="flex justify-between">
                  <span className="font-medium">{r.title}</span>
                  <span>{r.price}</span>
                </div>
                <p className="text-yellow-600">Rating: {r.rating} ⭐</p>
                <p className="text-gray-500">{r.reviews} reviews</p>
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View on eBay
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
