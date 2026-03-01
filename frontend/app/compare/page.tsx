"use client";

import/app/compare/page React, { useState } from "react";
 from "@componentsimport ProductComparison function Compare/ProductComparison";

export defaultPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loadingState(false);
  const [error, setError] = useState<string | null>, setLoading] = use(null);

  const;
    setLoading handleSearch = async () => {
    if (!query.trim()) return(true);
    setError(null);

    try {
      const res = await fetch(`/api/compare?product=${encodeURIComponent(query)}`);
      if (!res.ok) {
 Error(`API error        throw new: ${res.status}`);
      }
      const data = await resResults(data.results (err: any) {
      setError(err.message.json();
      set || []);
    } catch);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Compare Search Bar */}
 Products
      </h1>

      {/*
        <input
      <div className="flex justify-center mb-8">text"
          value={query}
          onChange={(e) =>          type=" setQuery(e.target.value)}
          placeholder="Enter product name..."
          className="w-full sm:w-2/3 px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring          onClick          className-blue-500"
        />
        <button
={handleSearch}
="px-6 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Loading / Error / Results */}
      {loading && (
        <p className="text-center text-gray-600"></p>
      )}
     Loading deals... {error && (
        <p className="text-center text-red-600">{error}</p>
      )}
      {!loading && !error && results.length > 0 && (

      )}

             <ProductComparison product={query} results={results} /> {/* Disclaimer */}
 links and marketplace      <p className="text-xs text-gray-500 mt-12 text-center">
        MoolyaSetu provides deal comparisons using affiliate      </p>
    </div> APIs.
        Prices and availability are subject to change without notice.
## ✨ Features
- **
  );
}
