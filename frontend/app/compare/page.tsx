"use client";
import { useState } from "react";

export default function ComparePage() {
  const [product, setProduct] = useState("");
  const [results, setResults] = useState<any>(null);

  async function fetchComparison() {
    if (!product) return;
    const res = await fetch(`/api/compare?product=${encodeURIComponent(product)}`);
    const data = await res.json();
    setResults(data);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">
        Product Comparison
      </h1>
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

      {results && (
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Best Option</h2>
          <p className="text-lg">
            {results.best_option.site} — {results.best_option.price}
          </p>

          <h2 className="text-2xl font-bold text-gray-700 mt-6 mb-4">All Results</h2>
          <ul className="divide-y divide-gray-200">
            {results.all_results.map((r: any, i: number) => (
              <li key={i} className="py-2 flex justify-between">
                <span className="font-medium">{r.site}</span>
                <span>{r.price || r.error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
