"use client";
import { useState } from "react";

export default function DashboardPage() {
  const [trackedProducts, setTrackedProducts] = useState([
    { name: "Toothbrush", lastPrice: "₹250", change: "+5%" },
    { name: "Laptop", lastPrice: "₹45,000", change: "-2%" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 p-8">
      <h1 className="text-4xl font-extrabold text-center text-green-600 mb-8">
        Dashboard
      </h1>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Tracked Products</h2>
        <ul className="divide-y divide-gray-200">
          {trackedProducts.map((p, i) => (
            <li key={i} className="py-2 flex justify-between items-center">
              <span className="font-medium">{p.name}</span>
              <div className="text-right">
                <span className="block">{p.lastPrice}</span>
                <span
                  className={`text-sm ${
                    p.change.startsWith("+") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {p.change}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
