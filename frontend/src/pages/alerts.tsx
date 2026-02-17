import { useState, useEffect } from "react";

export default function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [product, setProduct] = useState("");
  const [site, setSite] = useState("");
  const [alertType, setAlertType] = useState("");

  async function fetchAlerts() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/alerts`);
    const data = await res.json();
    setAlerts(data);
  }

  async function createAlert() {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/alerts?product=${product}&site=${site}&alert_type=${alertType}`;
    await fetch(url, { method: "POST" });
    fetchAlerts();
  }

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Alerts</h1>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Site"
          value={site}
          onChange={(e) => setSite(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Alert Type"
          value={alertType}
          onChange={(e) => setAlertType(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={createAlert}
          className="bg-green-500 text-white px-4 py-2"
        >
          Create Alert
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl">Existing Alerts</h2>
        <pre>{JSON.stringify(alerts, null, 2)}</pre>
      </div>
    </div>
  );
}
