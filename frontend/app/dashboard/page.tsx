"use client";

import React from "react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Your Dashboard
      </h1>

      <p className="text-center text-gray-600 mb-12">
        Welcome to your personalized hub. Here you’ll soon be able to manage alerts, 
        track saved comparisons, and view analytics on trending deals.
      </p>

      {/* Dashboard Sections */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Alerts */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4">Alerts</h2>
          <p className="text-sm text-gray-600 mb-4">
            Set up notifications for price drops and trending deals.
          </p>
          <Link
            href="/alerts"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Manage Alerts
          </Link>
        </div>

        {/* Saved Comparisons */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4">Saved Comparisons</h2>
          <p className="text-sm text-gray-600 mb-4">
            Keep track of products you’ve compared and revisit them anytime.
          </p>
          <Link
            href="/compare"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            View Comparisons
          </Link>
        </div>

        {/* Analytics */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4">Analytics</h2>
          <p className="text-sm text-gray-600 mb-4">
            Explore insights on trending products and marketplace activity.
          </p>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Coming Soon
          </Link>
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
