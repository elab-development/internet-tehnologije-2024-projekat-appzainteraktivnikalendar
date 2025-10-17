// src/pages/DashboardPatient.jsx
import React from "react";
import api from "../../api/api";
import { Button, Container } from "react-bootstrap";
import "../../styles/Dashboard.css";

const DashboardPatient = () => {
  const handleExportICS = async () => {
    try {
      const response = await api.get("/patient/appointments/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "appointments.ics");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Greška pri izvozu termina:", error);
      alert("Došlo je do greške prilikom izvoza termina.");
    }
  };

  return (
    <Container className="dashboard-container">
      <h1 className="dashboard-title">Dobrodošli na vaš nalog</h1>
      <div className="dashboard-buttons">
        <Button variant="primary" href="/patient/calendar">
          📅 Kalendar
        </Button>
        <Button variant="secondary" href="/patient/history">
          🩺 Istorija pregleda
        </Button>
        <Button variant="success" onClick={handleExportICS}>
          📤 Preuzmi .ICS fajl
        </Button>
      </div>
    </Container>
  );
};

export default DashboardPatient;
