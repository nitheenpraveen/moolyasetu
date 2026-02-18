// components/ProductComparison.tsx

"use client"; // for Next.js App Router

import { useState } from "react";

interface Product {
  site: string;
  title: string;
  price: string;
  rating: string;
  reviews: string;
  link: string;
  error?: string;
}

export default function ProductComparison() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [bestOption, setBestOption] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/compare?product=${encodeURIComponent(query)}`);
      const data = await res.json();

      setResults(data.all_results || []);
      setBestOption(data.best_option || null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setResults([]);
      setBestOption(null);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Product Comparison</h1>

      {/* Search Bar */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a product..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Compare
        </button>
      </div>

      {loading && <p className="text-center">Loading...</p>}

      {/* Best Option */}
      {bestOption && (
        <div className="mb-6 p-4 bg-green-100 rounded border border-green-300">
          <h2 className="font-semibold text-lg">Best Option</h2>
          <p className="font-bold">{bestOption.title}</p>
          <p>Price: {bestOption.price}</p>
          <p>Rating: {bestOption.rating} ⭐ | Reviews: {bestOption.reviews}</p>
          <a
            href={bestOption.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Product
          </a>
        </div>
      )}

      {/* All Results */}
      <div className="grid gap-4">
        {results.map((item, idx) => (
          <div key={idx} className="border rounded p-4">
            <h3 className="font-semibold">{item.site}</h3>
            {item.error ? (
              <p className="text-red-500">{item.error}</p>
            ) : (
              <>
                <p className="font-bold">{item.title}</p>
                <p>Price: {item.price}</p>
                <p>Rating: {item.rating} ⭐ | Reviews: {item.reviews}</p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Product
                </a>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
