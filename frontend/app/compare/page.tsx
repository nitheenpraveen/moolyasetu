"use client";
import { useState } from "react";

export default function Compare() {
  const [product, setProduct] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleCompare = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/compare?product=${encodeURIComponent(product)}`
      );
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching comparison data");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Compare Products</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter product name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleCompare}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Compare
        </button>
      </div>
      {result && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}