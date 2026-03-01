"use React, { useState } from "react";
 client";

import/ProductComparison";

export defaultPage() {
  const [query, setQueryimport ProductComparison from "@components  const [results function CompareState<any[]>([]);
  const [loading, setLoading] = use] = useState("");
State(false);
  const, setResults] = use [error, setError(null);

    try] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError {
      const resapi/compare?product=${encodeURIComponent(query)}`);
      = await fetch(`/ if (!res.ok) throw new Error(`API error: ${res.status}`);
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
        <input
Compare Products</h1>

      <div className="flex justify-center mb-8">          type="text"
          value={query}
          onChange={(e) => setQuery(e.target placeholder="Enter.value)}
          product name..."
          className3 px-4 py-2 border="w-full sm:w-2/:ring-2 focus:ring={handleSearch}
 rounded-l focus:outline-none focus-blue-500"
        />
        <button
          onClick          className="px-6 py-2 bg-blue-r hover:bg-blue-600 text-white rounded-700"
        >
          Search
        </button> {loading && <p className="text-center text-gray-600">
      </div>

     Loading deals...</p>}
      {error && <p className="text-center text-red-600"> {!loading && !error{error}</p>}
      > 0 && (
        && results.length
      )}
    </div> <ProductComparison product={query} results={results} />
  );
}
