"use client";
import { useState, useEffect } from "react";

interface Product {
  site: string;
  title: string;
  price: string;
  rating: string;
  reviews: string;
  link: string;
}

export default function ComparePage() {
  const [product, setProduct] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [bestOption, setBestOption] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchComparison() {
    if (!product) return;
    setLoading(true);
    setError("");
    setResults([]);
    setBestOption(null);

    try {
      const res = await fetch(`/api/compare?product=${encodeURIComponent(product)}`);
      const data = await res.json();
      setResults(data.all_results || []);
      setBestOption(data.best_option || null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch comparison results.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-gradient-x transition-all">
      {/* Header */}
      <header className="text-center py-10">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-2 animate-pulse">
          MoolyaSetu
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto">
          Smart shopping alerts & product comparisons. Find the best deals, ratings, and reviews instantly.
        </p>
      </header>

      {/* Search */}
      <div className="flex justify-center mb-8 flex-wrap gap-2">
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Enter product name..."
          className="border rounded-l-lg p-3 w-80 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          onClick={fetchComparison}
          className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 hover:scale-105 transform transition"
        >
          Compare
        </button>
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-center text-gray-600">Fetching results...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Best Option */}
      {bestOption && (
        <div className="max-w-3xl mx-auto mb-6 p-6 bg-gradient-to-r from-green-100 via-green-200 to-green-100 border border-green-400 rounded-xl shadow-lg transform hover:scale-105 transition">
          <h2 className="text-2xl font-bold text-green-700 mb-2 flex items-center gap-2">
            🏆 Best Option
          </h2>
          <p className="font-semibold mb-1">{bestOption.title}</p>
          <p className="text-lg text-green-800 mb-1">💰 {bestOption.price}</p>
          {bestOption.rating && <p className="text-yellow-600 mb-1">⭐ {bestOption.rating}</p>}
          {bestOption.reviews && <p className="text-gray-600 mb-1">📝 {bestOption.reviews} reviews</p>}
          <a
            href={bestOption.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-semibold"
          >
            🔗 View Product
          </a>
        </div>
      )}

      {/* All Results Grid */}
      {results.length > 0 && (
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Top Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((r, idx) => (
              <div
                key={idx}
                className={`border rounded-xl p-4 shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 ${
                  r === bestOption ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"
                }`}
              >
                <p className="font-semibold mb-1">🏷 {r.site}</p>
                <p className="text-gray-700 mb-1">{r.title}</p>
                <p className="text-gray-900 font-bold mb-1">💰 {r.price}</p>
                {r.rating && <p className="text-yellow-600 mb-1">⭐ {r.rating}</p>}
                {r.reviews && <p className="text-gray-500 mb-2">📝 {r.reviews} reviews</p>}
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  🔗 View Product
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-6 mt-10 text-gray-600">
        © 2026 MoolyaSetu. Made with ❤️ to help you find the best deals online.
      </footer>
    </div>
  );
}
