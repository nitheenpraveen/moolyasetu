import React from "react";

function Dashboard({ data }) {
  return (
    <div>
      <h1>User Dashboard</h1>
      <h2>Active Alerts</h2>
      <ul>
        {data.alerts.map((a) => (
          <li key={a.id}>{a.product} ({a.site}) — {a.alert_type}</li>
        ))}
      </ul>
      <h2>Forecasts</h2>
      <p>{data.forecasts}</p>
      <small style={{color:"red"}}>
        Disclaimer: Forecasts are based on past trends and are not guaranteed outcomes.
      </small>
    </div>
  );
}

export default Dashboard;
