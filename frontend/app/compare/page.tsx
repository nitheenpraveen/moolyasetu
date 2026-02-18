"use client";
import { useState } from "react";

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
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">
        MoolyaSetu - Product Comparison
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

      {/* Best Option */}
      {bestOption && (
        <div className="max-w-3xl mx-auto mb-6 p-4 bg-green-100 border border-green-300 rounded shadow-md">
          <h2 className="text-2xl font-bold text-green-700 mb-2">Best Option</h2>
          <p className="font-semibold">{bestOption.title}</p>
          <p className="text-lg text-green-800">Price: {bestOption.price}</p>
          {bestOption.rating && <p className="text-yellow-600">Rating: {bestOption.rating} ⭐</p>}
          {bestOption.reviews && <p className="text-gray-600">{bestOption.reviews} reviews</p>}
          <a
            href={bestOption.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Product
          </a>
        </div>
      )}

      {/* All Results */}
      {results.length > 0 && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Top Products</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {results.map((r, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-4 shadow-sm ${
                  r === bestOption ? "border-green-500" : "border-gray-200"
                }`}
              >
                <p className="font-semibold">{r.site}</p>
                <p className="text-gray-700">{r.title}</p>
                <p className="text-gray-900 font-bold">{r.price}</p>
                {r.rating && <p className="text-yellow-600">Rating: {r.rating} ⭐</p>}
                {r.reviews && <p className="text-gray-500">{r.reviews} reviews</p>}
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Product
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
