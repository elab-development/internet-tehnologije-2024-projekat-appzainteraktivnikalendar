import React, { useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "../../styles/Dashboard.css";

const DashboardPatient = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleExportICS = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="dashboard-container">
      <h1 className="dashboard-title">Dobrodošli na vaš nalog</h1>
      <div className="dashboard-buttons">
        <Button variant="primary" onClick={() => navigate("/patient/calendar")}>
          📅 Kalendar
        </Button>
        <Button variant="secondary" onClick={() => navigate("/patient/history")}>
          🩺 Istorija pregleda
        </Button>
        <Button variant="success" onClick={handleExportICS} disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Preuzimanje...
            </>
          ) : (
            "📤 Preuzmi .ICS fajl"
          )}
        </Button>
      </div>
    </Container>
  );
};

export default DashboardPatient;
