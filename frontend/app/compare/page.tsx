"use client";

import React, { useState } from "react";
import ProductComparison from "@components/ProductComparison";

export defaultPage() {
  const [query, setQuery function Compare] = useState("");
  const [resultsState<any[]>([]);
  const [loading, setLoading] = use, setResults] = useState(false);
  const handleSearch = async [error, setError] = useState<string | null>(null);

  const () => {
    if (!query.trim()) return {
      const res;
    setLoading(true);
    setError(null);

    try = await fetch(`/api/compare?product=${encodeURIComponent if (!res.ok) throw(query)}`);
      new Error(`API error      const data: ${res.status}`);
();
      setResults = await res.json(data.all_results (err: any) {
      {
      setLoading(false);
    }
  || []);
    } catch setError(err.message);
    } finally };

  return (

      <h1 className="text-3xl font-bold text-center mb-8">    <div className="max-w-5xl mx-auto px-6 py-12">Compare Products</h1>

      <div className="flex justify-center mb-8">
        <input
={query}
          onChange={(e) => setQuery(e.target.value)}
                   type="text"
          value placeholder="Enter product name..."
          className="w-full sm:w-2/ rounded-l focus3 px-4 py-2 border:outline-none focus:ring-2 focus:ring-blue-500"
                 onClick={handleSearch}
 />
        <button
          className          Search
        </button>="px-6 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
        >

      </div>

      {loading && <p className="text-center text-gray-600">Loading deals...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && results.length > 0 && (
        <ProductComparison product={query} results={results} />
      )}
    </div>
  );
}
