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
    } catch (err) {
      setError("Failed to fetch comparison results.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">
        Product Comparison
      </h1>

      {/* Search bar */}
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
          Compare
        </button>
      </div>

      {/* Loading / Error */}
      {loading && <p className="text-center text-gray-600">Fetching results...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Results */}
      {results && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Best Option */}
          {results.best_option && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 shadow-md">
              <h2 className="text-2xl font-bold text-green-700 mb-2">Best Option</h2>
              <p className="font-semibold">{results.best_option.title}</p>
              <p className="text-lg text-green-800">Price: {results.best_option.price}</p>
              {results.best_option.rating && (
                <p className="text-yellow-600">Rating: {results.best_option.rating} ⭐</p>
              )}
              {results.best_option.reviews && (
                <p className="text-gray-600">{results.best_option.reviews} reviews</p>
              )}
              {results.best_option.link && (
                <a
                  href={results.best_option.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Product
                </a>
              )}
            </div>
          )}

          {/* All Results */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-700">All Results</h2>
            {Array.isArray(results.all_results) && results.all_results.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {results.all_results.map((r: any, i: number) => (
                  <div
                    key={i}
                    className={`border rounded-lg p-4 shadow-sm ${
                      r === results.best_option ? "border-green-500" : "border-gray-200"
                    }`}
                  >
                    <p className="font-semibold">{r.site}</p>
                    {r.title && <p className="text-gray-700">{r.title}</p>}
                    {r.price && <p className="text-gray-900 font-bold">{r.price}</p>}
                    {r.rating && <p className="text-yellow-600">Rating: {r.rating} ⭐</p>}
                    {r.reviews && <p className="text-gray-500">{r.reviews} reviews</p>}
                    {r.link && (
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Product
                      </a>
                    )}
                    {r.error && <p className="text-red-500">{r.error}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No results found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
