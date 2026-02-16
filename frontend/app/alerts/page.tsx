"use client";
import { useEffect, useState } from "react";

export default function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/alerts`)
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Your Alerts</h1>
      <ul className="space-y-2">
        {alerts.map((a) => (
          <li
            key={a.id}
            className="border p-3 rounded bg-white shadow-sm"
          >
            <span className="font-semibold">{a.product}</span> — {a.site} ({a.alert_type})
          </li>
        ))}
      </ul>
    </main>
  );
}