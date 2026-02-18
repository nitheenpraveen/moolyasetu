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
      // Only keep eBay results for now
      if (data.all_results) {
        data.all_results = data.all_results.filter((r: any) => r.site === "eBay");
        data.best_option = data.best_option?.site === "eBay" ? data.best_option : null;
      }
      setResults(data);
    } catch {
      setError("Failed to fetch Nirṇaya results.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-50 p-8">
      {/* Animated decorative circles */}
      <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-slow" />
      <div className="absolute bottom-[-60px] right-[-40px] w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse-slow delay-2000" />

      <h1 className="text-5xl md:text-6xl font-extrabold text-center text-blue-700 mb-8 animate-fade-in">
        Nirṇaya
      </h1>
      <p className="text-center text-gray-700 mb-10 max-w-xl mx-auto animate-fade-in delay-500">
        Make the best choice with smart product insights, pricing, ratings, and reviews from top e-commerce platforms.
      </p>

      {/* Search Bar */}
      <div className="flex justify-center mb-6 animate-fade-in delay-1000">
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

      {/* Loading & Error */}
      {loading && (
        <p className="text-center text-gray-600 animate-pulse">Fetching Nirṇaya results...</p>
      )}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Results */}
      {results && results.all_results?.length > 0 && (
        <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-xl p-6 animate-fade-in delay-1500">
          {/* Best Option */}
          {results.best_option && (
            <div className="mb-6 p-4 border-l-4 border-green-500 bg-green-50 rounded">
              <h2 className="text-2xl font-bold text-green-700 mb-2">सर्वोत्कृष्ट (Sarvotkṛṣṭa)</h2>
              <p className="font-semibold">{results.best_option.site} — {results.best_option.price}</p>
              {results.best_option.rating && (
                <p className="text-yellow-600">Rating: {results.best_option.rating} ⭐</p>
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
                  View Product
                </a>
              )}
            </div>
          )}

          {/* All Results */}
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Other Options</h2>
          <ul className="divide-y divide-gray-200">
            {results.all_results.map((r: any, i: number) => (
              <li key={i} className="py-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{r.site}</span>
                  <span>{r.price || r.error}</span>
                </div>
                {r.title && <p c
