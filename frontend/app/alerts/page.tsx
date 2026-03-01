"use client";

import React from "react";

export default function AlertsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Alerts & Notifications
      </h1>

      <p className="text-center text-gray-600 mb-12">
        Stay ahead of the deals. Soon, you’ll be able to set up alerts for price drops, 
        trending products, and marketplace updates — delivered directly to your dashboard.
      </p>

      {/* Placeholder Sections */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Price Drop Alerts */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4">Price Drop Alerts</h2>
          <p className="text-sm text-gray-600 mb-4">
            Get notified when your favorite products go on sale.
          </p>
          <button
            disabled
            className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>

        {/* Trending Products */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4">Trending Products</h2>
          <p className="text-sm text-gray-600 mb-4">
            Discover what’s hot across Amazon, Flipkart, and eBay.
          </p>
          <button
            disabled
            className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>

        {/* Marketplace Updates */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4">Marketplace Updates</h2>
          <p className="text-sm text-gray-600 mb-4">
            Stay informed about new deals and offers from marketplaces.
          </p>
          <button
            disabled
            className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 mt-12 text-center">
        MoolyaSetu provides deal comparisons using affiliate links and marketplace APIs. 
        Prices and availability are subject to change without notice.
      </p>
    </div>
  );
}
