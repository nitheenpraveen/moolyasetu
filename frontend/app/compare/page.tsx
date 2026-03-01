"use client";

import React, { useState } from "react";
import ProductComparison from "../../components/ProductComparison";

export default function ComparePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(`/api/compare?product=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results);
      }
    } catch (err) {
      setError("Failed to fetch comparison data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">
        Compare Deals Across Marketplaces
      </h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex justify-center mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a product (e.g., iPhone 15)"
          className="w-full sm:w-2/3 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
        >
          Compare
        </button>
      </form>

      {/* Loading / Error / Results */}
      {loading && <p className="text-center text-gray-600">Loading deals...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {results.length > 0 && <ProductComparison product={query} results={results} />}
    </div>
  );
}
