"use client";
import { useState } from "react";

export default function NirnayaPage() {
  const [product, setProduct] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [bestOption, setBestOption] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchNirnaya() {
    if (!product) return;
    setLoading(true);
    setError("");
    setResults([]);
    setBestOption(null);

    try {
      const res = await fetch(`/api/compare?product=${encodeURIComponent(product)}`);
      const data = await res.json();

      if (!data.all_results || data.all_results.length === 0) {
        setError("No results found.");
      } else {
        setResults(data.all_results);
        setBestOption(data.best_option);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch results. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-8 relative overflow-hidden bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-50 animate-gradient-x">
      {/* Title & Description */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-center text-purple-700 mb-6">
        Nirṇaya
      </h1>
      <p className="text-lg md:text-xl text-center text-gray-700 mb-10 max-w-2xl mx-auto">
        Make smart shopping decisions instantly. Compare prices, ratings, and reviews across eBay products — all in one place.
      </p>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Enter product name..."
          className="border rounded-lg p-4 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-lg"
        />
        <button
          onClick={fetchNirnaya}
          className="bg-purple-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-purple-700 transition font-semibold"
        >
          Compare
        </button>
      </div>

      {/* Loading & Error */}
      {loading && <p className="text-center text-gray-600 text-lg animate-pulse">Fetching results...</p>}
      {error && <p className="text-center text-red-600 text-lg">{error}</p>}

      {/* Best Option */}
      {bestOption && (
        <div className="max-w-3xl mx-auto bg-green-50 shadow-2xl rounded-lg p-6 mb-10 border-l-8 border-green-500">
          <h2 className="text-2xl font-bold text-green-700 mb-2">Best Choice</h2>
          <p className="font-semibold">{bestOption.site} — {bestOption.price}</p>
          {bestOption.rating && <p className="text-yellow-600">Rating: {bestOption.rating} ⭐</p>}
          {bestOption.reviews && <p className="text-gray-500">{bestOption.reviews} reviews</p>}
          <a
            href={bestOption.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-700 font-semibold hover:underline mt-2 inline-block"
          >
            View Product on eBay
          </a>
        </div>
      )}

      {/* All Results */}
      {results.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">All Results</h2>
          <ul className="divide-y divide-gray-200">
            {results.map((r, i) => (
              <li key={i} className="py-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                  <span className="font-semibold text-gray-800">{r.title}</span>
                  <span className="text-gray-700 font-medium">{r.price}</span>
                </div>
                <div className="flex flex-col md:flex-row gap-4 text-sm md:text-base text-gray-600 mb-1">
                  {r.rating && <span>Rating: {r.rating} ⭐</span>}
                  {r.reviews && <span>{r.reviews} reviews</span>}
                </div>
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline font-medium"
                >
                  View on eBay
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
    </div>
  );
}
