"use client";

import { useState } from "react";

interface Product {
  site: string;
  title: string;
  price: number;
  link: string;
  confidence: number;
  forecast: string;
}

export default function ProductComparison() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [bestOption, setBestOption] = useState<Product | null>(null);

  const handleSearch = async () => {
    const res = await fetch(`/api/compare?product=${query}`);
    const data = await res.json();
    setResults(data.all_results);
    setBestOption(data.best_option);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search smarter. Buy safer."
        className="border p-3 w-full rounded"
      />

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white p-3 mt-3 rounded w-full"
      >
        Compare Prices
      </button>

      {bestOption && (
        <div className="bg-green-100 p-4 mt-6 rounded">
          <h2 className="text-xl font-bold mb-2">🔥 Best Trusted Deal</h2>
          <p>{bestOption.title}</p>
          <p className="font-semibold">₹{bestOption.price}</p>
          <p className="text-green-700 font-semibold">
            Confidence: {bestOption.confidence}%
          </p>
          <p className="text-orange-600">{bestOption.forecast}</p>

          <a
            href={bestOption.link}
            target="_blank"
            className="text-blue-600 underline"
          >
            Buy Safely
          </a>
        </div>
      )}

      {results.map((r, i) => (
        <div key={i} className="border p-4 mt-4 rounded">
          <p className="font-medium">{r.title}</p>
          <p>₹{r.price}</p>
          <p className="text-green-700">Trust: {r.confidence}%</p>
          <p className="text-orange-600">{r.forecast}</p>

          <a
            href={r.link}
            target="_blank"
            className="text-blue-600 underline"
          >
            View Deal
          </a>
        </div>
      ))}
    </div>
  );
}
