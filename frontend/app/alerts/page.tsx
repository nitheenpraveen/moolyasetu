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
          onChange={(e) => setNewPrice(e.target.value
