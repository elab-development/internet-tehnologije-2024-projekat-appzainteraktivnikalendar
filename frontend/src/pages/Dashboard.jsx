// src/pages/Dashboard.jsx
import React from "react";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard-page">
      <h2>Dobrodošli, {user.first_name}!</h2>

      {user.role === "admin" && (
        <p>Ovo je vaša početna stranica za administratore. Možete upravljati lekarima i specijalizacijama.</p>
      )}

      {user.role === "doctor" && (
        <p>Ovo je vaša početna stranica za doktore. Možete pregledati zakazane termine i istoriju pregleda.</p>
      )}

      {user.role === "patient" && (
        <p>Ovo je vaša početna stranica za pacijente. Možete zakazati pregled ili pregledati istoriju termina.</p>
      )}
    </div>
  );
}

export default Dashboard;
