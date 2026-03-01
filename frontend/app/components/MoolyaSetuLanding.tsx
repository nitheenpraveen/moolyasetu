"use client";

import React from "react";
import Link from "next/link";

export default function MoolyaSetuLanding() {
  const trendingProducts = [
    {
      name: "iPhone 15",
      amazon: `https://www.amazon.in/s?k=iPhone+15&tag=${process.env.AMAZON_TAG}`,
      flipkart: "https://www.flipkart.com/search?q=iPhone+15",
    },
    {
      name: "Samsung Galaxy S24",
      amazon: `https://www.amazon.in/s?k=Samsung+Galaxy+S24&tag=${process.env.AMAZON_TAG}`,
      flipkart: "https://www.flipkart.com/search?q=Samsung+Galaxy+S24",
    },
    {
      name: "MacBook Air M2",
      amazon: `https://www.amazon.in/s?k=MacBook+Air+M2&tag=${process.env.AMAZON_TAG}`,
      flipkart: "https://www.flipkart.com/search?q=MacBook+Air+M2",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          MoolyaSetu – Your Best Deal Finder
        </h1>
        <p className="text-lg sm:text-xl mb-6">
          Compare prices instantly across Amazon, Flipkart, and eBay.
        </p>
        <Link
          href="/compare"
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-md shadow hover:bg-gray-100"
        >
          Start Comparing
        </Link>
      </section>

      {/* Meaning Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold mb-6">What is MoolyaSetu?</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          <span className="font-semibold">MoolyaSetu</span> means “Bridge of Value.” 
          It is designed to connect shoppers with the best deals across marketplaces, 
          saving time, money, and effort. Our mission is to empower users with transparent 
          comparisons and affiliate‑powered insights.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          Unlike traditional comparison sites, MoolyaSetu is built to deliver exceptional 
          value by combining affiliate deals from Amazon and Flipkart with live marketplace 
          data from eBay. This ensures that your launch page is never empty, always trending, 
          and always focused on helping you make smarter shopping decisions.
        </p>
      </section>

      {/* Trending Products */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">
          Trending Deals
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingProducts.map((product, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold mb-4">{product.name}</h3>
              <div className="flex flex-col gap-3">
                <a
                  href={product.amazon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  View on Amazon
                </a>
                <a
                  href={product.flipkart}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View on Flipkart
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-6xl mx-auto px-6 pb-10 text-center text-sm text-gray-500">
        <p>As an Amazon Associate I earn from qualifying purchases.</p>
        <p>Flipkart and eBay links are provided for comparison purposes. Prices and availability are subject to change without notice.</p>
      </section>
    </div>
  );
}
