"use client";
import { useState } from "react";

export default function AlertsPage() {
  const [email, setEmail] = useState("");
  const [alertProduct, setAlertProduct] = useState("");
  const [message, setMessage] = useState("");

  function handleCreateAlert() {
    if (!email || !alertProduct) {
      setMessage("Please enter both email and product name.");
      return;
    }
    setMessage(`Alert created for ${alertProduct} (${email})`);
    setEmail("");
    setAlertProduct("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-100 to-pink-100 p-8">
      <h1 className="text-4xl font-bold text-green-600 mb-6 text-center">Manage Alerts</h1>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          value={alertProduct}
          onChange={(e) => setAlertProduct(e.target.value)}
          placeholder="Product to watch"
          className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={handleCreateAlert}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition w-
