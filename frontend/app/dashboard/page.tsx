"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {data ? (
        <div className="bg-gray-100 p-4 rounded shadow">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p className="text-gray-600">Loading dashboard data...</p>
      )}
    </main>
  );
}