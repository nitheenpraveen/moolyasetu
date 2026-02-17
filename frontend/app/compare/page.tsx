"use client";
import { useState } from "react";

export default function ComparePage() {
  const [product, setProduct] = useState("");
  const [results, setResults] = useState<any>(null);

  async function fetchComparison() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/compare?product=${product}`
    );
    const data = await res.json();
    setResults(data);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Product Comparison</h1>
      <input
        type="text"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        placeholder="Enter product name"
        className="border p-2 mr-2"
      />
      <button
        onClick={fetchComparison}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Compare
      </button>

      {results && (
        <div className="mt-4">
          <h2 className="text-xl">Best Option</h2>
          <pre>{JSON.stringify(results.best_option, null, 2)}</pre>

          <h2 className="text-xl mt-4">All Results</h2>
          <pre>{JSON.stringify(results.all_results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}