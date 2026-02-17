import { useState, useEffect } from "react";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<any>(null);

  async function fetchDashboard() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/dashboard`);
    const data = await res.json();
    setDashboard(data);
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {dashboard ? (
        <pre>{JSON.stringify(dashboard, null, 2)}</pre>
      ) : (
        <p>Loading dashboard...</p>
      )}
    </div>
  );
}
