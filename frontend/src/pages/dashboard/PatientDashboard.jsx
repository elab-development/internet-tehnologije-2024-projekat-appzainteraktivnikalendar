import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import Navbar from "../../components/Navbar";
import { Button, Container } from "react-bootstrap";

const PatientDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="dashboard-container">
        <Container className="text-center">
          <h2 className="dashboard-title">Dobrodošli na svoj nalog</h2>
          <p className="dashboard-subtitle">
            Izaberite jednu od sledećih opcija:
          </p>
          <div className="dashboard-buttons">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/patient/calendar")}
            >
              📅 Kalendar
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              onClick={() => navigate("/patient/history")}
            >
              🩺 Istorija pregleda
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={() => alert("Preuzimanje .ics fajla uskoro!")}
            >
              ⬇️ Preuzmi .ics
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default PatientDashboard;
