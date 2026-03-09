"use client";

import React, { useState } from "react";
import ProductComparison from "@/components/ProductComparison";

export default function ComparePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/compare?product=${encodeURIComponent(query)}`);

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setResults(data.all_results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Compare Products
      </h1>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter product name..."
          className="w-full sm:w-2/3 px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading && (
        <p className="text-center text-gray-600">Loading deals...</p>
      )}

      {error && (
        <p className="text-center text-red-600">{error}</p>
      )}

      {!loading && !error && results.length > 0 && (
       <ProductComparison data={results} />
      )}
    </div>
  );
}