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
      setError("Failed to fetch results. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-50 flex flex-col items-center p-8 relative overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <img src="/assets/abstract_shapes.svg" alt="abstract shapes" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-5xl md:text-6xl font-extrabold text-center text-purple-800 mb-6 animate-pulse">
        Nirṇaya
      </h1>
      <p className="text-lg text-gray-700 text-center mb-8 max-w-xl">
        Compare products instantly. Find the best prices, links, and quick details from eBay sandbox.
      </p>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 w-full md:w-auto justify-center">
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Enter product name..."
          className="rounded-lg p-3 w-72 md:w-96 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={fetchComparison}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition transform hover:scale-105"
        >
          Fetch Nirṇaya
        </button>
      </div>

      {/* Loading & Error */}
      {loading && <p className="text-center text-gray-600 animate-pulse">Fetching results...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Results */}
      {results && (
        <div className="w-full max-w-4xl space-y-6">
          {/* Best Option */}
          {results.best_option && (
            <div className="p-6 border-l-4 border-green-500 bg-green-50 rounded-lg shadow-md animate-fadeIn">
              <h2 className="text-2xl font-bold text-green-700 mb-2">Best Option</h2>
              <p className="font-semibold">{results.best_option.site} — {results.best_option.price}</p>
              {results.best_option.rating && <p className="text-yellow-600">Rating: {results.best_option.rating} ⭐</p>}
              {results.best_option.reviews && <p className="text-gray-500">{results.best_option.reviews} reviews</p>}
              <a href={results.best_option.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                View Product
              </a>
            </div>
          )}

          {/* All Results */}
          <h2 className="text-2xl font-bold text-gray-700">All Results</h2>
          <ul className="grid md:grid-cols-2 gap-4">
            {Array.isArray(results.all_results) &&
              results.all_results.map((r: any, i: number) => (
                <li key={i} className="bg-white rounded-lg shadow-lg p-4 hover:scale-105 transition transform animate-fadeIn">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{r.site}</span>
                    <span className="font-semibold">{r.price}</span>
                  </div>
                  {r.title && <p className="text-gray-700 mb-2">{r.title}</p>}
                  {r.rating && <p className="text-yellow-600 mb-1">Rating: {r.rating} ⭐</p>}
                  {r.reviews && <p className="text-gray-500 mb-2">{r.reviews} reviews</p>}
                  <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Product
                  </a>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
