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

    try {
      const res = await fetch(`/api/compare?product=${encodeURIComponent(product)}`);
      const data = await res.json();
      console.log("API RESPONSE:", data); // helpful debug
      setResults(data);
    } catch {
      setError("Failed to fetch results.");
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(value: any) {
    const number = Number(value);
    if (isNaN(number)) return value;

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(number);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-50 flex flex-col items-center p-8">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-purple-700 mb-3">
          Nirṇaya
        </h1>
        <p className="text-gray-700 text-lg max-w-xl mx-auto">
          Compare product prices instantly and find the best deal across marketplaces.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-center mb-8 w-full max-w-xl">
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Search for a product (e.g. iPhone 15)"
          className="border border-purple-300 text-black rounded-l-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={fetchComparison}
          className="bg-purple-600 text-white px-6 py-3 rounded-r-lg hover:bg-purple-700 transition"
        >
          Compare
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex flex-col items-center mt-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
          <p className="text-gray-600 mt-2">Fetching best deals...</p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-600 mt-4">{error}</p>
      )}

      {/* RESULTS */}
      {results && !loading && (
        <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-6 mt-6">

          {/* BEST OPTION */}
          {results.best_option && (
            <div className="mb-6 p-4 border-l-4 border-green-500 bg-green-50 rounded">
              <h2 className="text-2xl font-bold text-green-700 mb-3">
                🏆 Best Deal
              </h2>

              {results.best_option.image && (
                <img
                  src={results.best_option.image}
                  alt="Best Product"
                  className="w-40 h-40 object-contain mb-3"
                />
              )}

              <p className="font-semibold text-lg">
                {results.best_option.site} —{" "}
                {formatCurrency(results.best_option.price)}
              </p>

              {results.best_option.link && (
                <a
                  href={results.best_option.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-2 block"
                >
                  View Product
                </a>
              )}
            </div>
          )}

          {/* ALL RESULTS */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            All Results
          </h2>

          {Array.isArray(results.all_results) && results.all_results.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {results.all_results.map((r: any, i: number) => (
                <li key={i} className="py-4 flex gap-4">

                  {r.image && (
                    <img
                      src={r.image}
                      alt="Product"
                      className="w-24 h-24 object-contain"
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">
                        {r.site}
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(r.price)}
                      </span>
                    </div>

                    {r.title && (
                      <p className="text-gray-600 text-sm mb-1">
                        {r.title}
                      </p>
                    )}

                    {r.link && (
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Product
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No results found.</p>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-600 mt-12 border-t pt-4 w-full max-w-4xl">
        Data provided by eBay API. Prices may vary and are subject to change.
      </footer>

    </div>
  );
}
