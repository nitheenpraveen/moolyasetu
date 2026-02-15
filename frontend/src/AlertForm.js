import React, { useState } from "react";

function AlertForm({ onSubmit }) {
  const [product, setProduct] = useState("");
  const [site, setSite] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ product, site, alertType });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Alert</h2>
      <input placeholder="Product" value={product} onChange={(e) => setProduct(e.target.value)} />
      <input placeholder="Site" value={site} onChange={(e) => setSite(e.target.value)} />
      <input placeholder="Alert Type" value={alertType} onChange={(e) => setAlertType(e.target.value)} />
      <button type="submit">Create</button>
    </form>
  );
}

export default AlertForm;
