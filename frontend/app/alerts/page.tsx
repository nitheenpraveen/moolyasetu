"use client";
import { useState } from "react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([
    { product: "Toothbrush", price: "₹900", id: 1 },
    { product: "Wireless Mouse", price: "₹500", id: 2 },
  ]);
  const [newProduct, setNewProduct] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const addAlert = () => {
    if (!newProduct || !newPrice) return;
    setAlerts([...alerts, { product: newProduct, price: newPrice, id: Date.now() }]);
    setNewProduct("");
    setNewPrice("");
  };

  const removeAlert = (id: number) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
        Price Alerts
      </h1>

      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
          className="border rounded-l-lg p-3 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Target Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="border p-3 w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={addAlert}
          className="bg-green-600 text-white px-4 py-3 rounded-r-lg hover:bg-green-700 transition"
        >
          Add Alert
        </button>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {alerts.length > 0 ? (
          alerts.map((a) => (
            <div
              key={a.id}
              className="bg-white p-5 rounded-lg shadow-md flex justify-between items-center transition hover:scale-105 hover:shadow-lg"
            >
              <div>
                <p className="font-semibold text-gray-800">{a.product}</p>
                <p className="text-gray-600 text-sm">Target Price: {a.price}</p>
              </div>
              <button
                onClick={() => removeAlert(a.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-700">No alerts yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}
