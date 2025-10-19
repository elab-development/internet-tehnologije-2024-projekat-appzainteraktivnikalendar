import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaUserMd } from "react-icons/fa";
import "../../styles/Dashboard.css";

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

const DashboardAdmin = () => {
  const navigate = useNavigate();

  return (
    <Container className="dashboard-container my-5">
      <h1 className="dashboard-title display-4">Dobrodošli, Administrator</h1>
      <p className="lead text-muted mb-5">
        Upravljajte doktorima i njihovim nalozima.
      </p>

      <Row xs={1} md={2} className="g-4 justify-content-center">
        {/* Dodavanje novog doktora */}
        <Col>
          <DashboardCard
            icon={<FaUserPlus size={36} />}
            title="Dodaj doktora"
            text="Kreirajte novi nalog za doktora."
            variant="primary"
            onClick={() => navigate("/admin/add-doctor")}
          />
        </Col>

        {/* Lista svih doktora */}
        <Col>
          <DashboardCard
            icon={<FaUserMd size={36} />}
            title="Pregled doktora"
            text="Pregledajte i upravljajte svim doktorima u sistemu."
            variant="secondary"
            onClick={() => navigate("/admin/doctors")}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardAdmin;
