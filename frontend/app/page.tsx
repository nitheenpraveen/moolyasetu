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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-50 flex flex-col items-center p-8">

      {/* Background SVG */}
      <div className="absolute inset-0 -z-10">
        <img src="/assets/abstract_shapes.svg" alt="Background Shapes" className="w-full h-full object-cover" />
      </div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-center text-purple-700 mb-8 animate-fadeIn">
        Nirṇaya
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6 animate-fadeIn delay-200">
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Enter product name..."
          className="border rounded-l-lg p-3 w-80 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={fetchComparison}
          className="bg-purple-600 text-white px-6 py-3 rounded-r-lg hover:bg-purple-700 transition"
        >
          Compare
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex flex-col items-center mt-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
          <p className="text-gray-600 mt-2">Fetching best deals...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-red-600 mt-4">{error}</p>
      )}

      {/* Results */}
      {results && (
        <div className="max-w-3xl w-full mx-auto bg-white shadow-2xl rounded-lg p-6 mt-6">

          {/* Best Option */}
          {results.best_option && (
            <div className="mb-6 p-4 border-l-4 border-green-500 bg-green-50 rounded">
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Best Deal
              </h2>

              {results.best_option.image && (
                <img
                  src={results.best_option.image}
                  alt="Best Product"
                  className="w-40 h-40 object-contain mb-3"
                />
              )}

              <p className="font-semibold">
                {results.best_option.site} —{" "}
                {formatCurrency(results.best_option.price)}
              </p>

              {results.best_option.link && (
                <a
                  href={results.best_option.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-1 block"
                >
                  View Product
                </a>
              )}
            </div>
          )}

          {/* All Results */}
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            All Results
          </h2>

          <ul className="divide-y divide-gray-200">
            {Array.isArray(results.all_results) &&
              results.all_results.map((r: any, i: number) => (
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
                      <span>
                        {formatCurrency(r.price) || r.error}
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
        </div>
      )}

      {/* Footer Disclaimer */}
      <footer className="text-center text-sm text-gray-600 mt-12 border-t pt-4">
        Data provided by eBay API. Prices may vary and are subject to change.
      </footer>

    </div>
  );
}
