"use client";
import { useState } from "react";

export default function AlertsPage() {
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState("");
  const [alerts, setAlerts] = useState<{ product: string; email: string }[]>([]);
  const [message, setMessage] = useState("");

  function addAlert() {
    if (!product || !email) {
      setMessage("Please enter both product and email.");
      return;
    }
    setAlerts([...alerts, { product, email }]);
    setMessage("Alert added successfully!");
    setProduct("");
    setEmail("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 p-8">
      <h1 className="text-4xl font-extrabold text-center text-purple-600 mb-8">
        Manage Alerts
      </h1>
      <div className="max-w-md mx-auto mb-6 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Product name..."
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="border rounded-l-lg p-3 w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="email"
          placeholder="Your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={addAlert}
          className="bg-purple-600 text-white px-4 py-3 rounded-r-lg hover:bg-purple-700 transition"
        >
          Add Alert
        </button>
      </div>

      {message && (
        <p className="text-center text-green-600 font-medium mb-4">{message}</p>
      )}

      {alerts.length > 0 && (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Alerts</h2>
          <ul className="divide-y divide-gray-200">
            {alerts.map((a, i) => (
              <li key={i} className="py-2 flex justify-between items-center">
                <span>{a.product}</span>
                <span className="text-gray-500">{a.email}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
