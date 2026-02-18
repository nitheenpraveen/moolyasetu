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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">Product Comparison</h1>

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
          Compare
        </button>
      </div>

      {loading && <p className="text-center text-gray-600">Fetching results...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {results && (
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
          {results.best_option && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-green-600 mb-2">Best Option</h2>
              <p><span className="font-semibold">{results.best_option.site}</span> — {results.best_option.price}</p>
              {results.best_option.rating && <p className="text-sm text-yellow-600">Rating: {results.best_option.rating} ⭐</p>}
              {results.best_option.reviews && <p className="text-sm text-gray-500">{results.best_option.reviews} reviews</p>}
              {results.best_option.link && (
                <a href={results.best_option.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View Product
                </a>
              )}
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-700 mb-4">All Results</h2>
          <ul className="divide-y divide-gray-200">
            {Array.isArray(results.all_results) &&
              results.all_results.map((r: any, i: number) => (
                <li key={i} className="py-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{r.site}</span>
                    <span>{r.price || r.error}</span>
