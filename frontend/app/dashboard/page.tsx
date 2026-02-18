"use client";
import { useState } from "react";

export default function DashboardPage() {
  const [recentSearches] = useState(["Toothbrush", "Wireless Mouse", "Smartphone"]);
  const [recentAlerts] = useState([
    { product: "Toothbrush", price: "₹900" },
    { product: "Wireless Mouse", price: "₹500" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
        Dashboard
      </h1>

      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Recent Searches */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Searches</h2>
          <ul className="space-y-2">
            {recentSearches.map((item, i) => (
              <li key={i} className="text-gray-700 bg-gray-100 p-2 rounded hover:bg-gray-200 transition">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Active Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Alerts</h2>
          <ul className="space-y-2">
            {recentAlerts.map((alert, i) => (
              <li key={i} className="flex justify-between bg-gray-100 p-2 rounded hover:bg-gray-200 transition">
                <span>{alert.product}</span>
                <span className="font-semibold">{alert.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Activity Graph Placeholder */}
      <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Activity Overview</h2>
        <p className="text-gray-600 text-sm">Graphs and analytics can be added here in the next version.</p>
      </div>
    </div>
  );
}
