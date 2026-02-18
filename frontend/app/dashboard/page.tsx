"use client";
import { useState } from "react";

export default function DashboardPage() {
  const [alerts, setAlerts] = useState([
    { product: "iPhone 15", price: "₹70,000" },
    { product: "Samsung TV", price: "₹45,000" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8">
      <h1 className="text-4xl font-bold text-purple-600 mb-6 text-center">Dashboard</h1>
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Alerts</h2>
        <ul className="divide-y divide-gray-200">
          {alerts.map((a, i) => (
            <li key={i} className="py-2 flex justify-between">
              <span>{a.product}</span>
              <span className="font-semibold">{a.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
