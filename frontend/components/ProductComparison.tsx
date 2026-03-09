"use client";

import React from "react";

type Product = {
  title: string;
  price: number;
  image: string;
  link: string;
  source: string;
};

interface ProductComparisonProps {
  data?: Product[];
  error?: string | null;
}

export default function ProductComparison({ data, error }: ProductComparisonProps) {

  if (error) {
    return (
      <p className="text-red-500 text-center mt-4">
        {error}
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-4">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {data.map((product, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-40 object-cover mb-3 rounded"
          />

          <h3 className="text-sm font-semibold mb-2 line-clamp-2">
            {product.title}
          </h3>

          <p className="text-green-600 font-bold text-lg mb-2">
            ₹{product.price}
          </p>

          <p className="text-xs text-gray-500 mb-3">
            Source: {product.source}
          </p>

          <a
            href={product.link}
            target="_blank"
            rel="nofollow noreferrer"
            className="block text-center bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            View Deal
          </a>
        </div>
      ))}
    </div>
  );
}