// src/pages/doctor/DashboardDoctor.jsx
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaHistory } from "react-icons/fa";
import "../../styles/Dashboard.css";

// Reuse DashboardCard
const DashboardCard = ({ icon, title, text, variant, onClick }) => (
  <Card
    className={`shadow-sm border-0 h-100 text-center dashboard-card ${variant}`}
    onClick={onClick}
    role="button"
  >
    <Card.Body className="d-flex flex-column justify-content-center align-items-center p-4">
      <div className={`icon-wrapper mb-3 text-${variant}`}>{icon}</div>
      <Card.Title className="fw-bold fs-5 mb-1">{title}</Card.Title>
      <Card.Text className="text-muted small">{text}</Card.Text>
    </Card.Body>
  </Card>
);

const DashboardDoctor = () => {
  const navigate = useNavigate();

  return (
    <Container className="dashboard-container my-5">
      <h1 className="dashboard-title display-4">Dobrodošli na vaš nalog</h1>
      <p className="lead text-muted mb-5">
        Izaberite jednu od opcija za upravljanje vašim terminima i istorijom.
      </p>

      <Row xs={1} md={2} className="g-4 justify-content-center">
        {/* Lista zakazanih termina */}
        <Col>
          <DashboardCard
            icon={<FaCalendarAlt size={36} />}
            title="Zakazani termini"
            text="Pregledajte sve aktivne i buduće termine."
            variant="primary"
            onClick={() => navigate("/doctor/appointments")}
          />
        </Col>

        {/* Istorija pregleda */}
        <Col>
          <DashboardCard
            icon={<FaHistory size={36} />}
            title="Istorija pregleda"
            text="Pristupite završenim pregledima i beleškama."
            variant="secondary"
            onClick={() => navigate("/doctor/history")}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardDoctor;
