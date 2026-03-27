import React, { useState } from "react";
import { Button, Container, Spinner, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaHistory, FaDownload } from "react-icons/fa"; // Dodali smo ikone
import api from "../../api/api";
import "../../styles/Dashboard.css"; // Zadržavamo vaš CSS fajl

// Pomoćna komponenta za kartice/dugmad
const DashboardCard = ({
  icon,
  title,
  text,
  variant,
  onClick,
  isLoading,
  disabled,
}) => (
  <Card
    className={`shadow-sm border-0 h-100 text-center dashboard-card ${variant}`}
    onClick={!disabled ? onClick : null}
    role="button"
  >
    <Card.Body className="d-flex flex-column justify-content-center align-items-center p-4">
      <div className={`icon-wrapper mb-3 text-${variant}`}>{icon}</div>
      <Card.Title className="fw-bold fs-5 mb-1">{title}</Card.Title>
      <Card.Text className="text-muted small">{text}</Card.Text>

      {/* Dugme za akciju (koristimo samo za ICS export) */}
      {variant === "success" && (
        <Button variant={variant} className="mt-3 w-100" disabled={disabled}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />{" "}
              Preuzimanje...
            </>
          ) : (
            <>
              <FaDownload className="me-2" /> {title}
            </>
          )}
        </Button>
      )}
    </Card.Body>
  </Card>
);

const DashboardPatient = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleExportICS = async () => {
    setLoading(true);
    try {
      const response = await api.get("/patient/appointments/export");

      const blob = new Blob([response.data], { type: "text/calendar" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "appointments.ics");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      let errorMessage =
        "Došlo je do nepoznate greške prilikom izvoza termina.";

      if (error.response) {
        const { status, data } = error.response;

        if (status === 404 && data?.message) {
          errorMessage = data.message;
        } else if (data?.message) {
          errorMessage = `Greška ${status}: ${data.message}`;
        } else {
          errorMessage = `Server je vratio grešku ${status}. Molimo pokušajte ponovo.`;
        }
      } else if (error.request) {
        errorMessage =
          "Nema odgovora sa servera. Proverite internet vezu ili status servera.";
      }

      console.error("Greška pri izvozu termina:", error);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="dashboard-container my-5">
      <h1 className="dashboard-title display-4">Dobrodošli na vaš nalog</h1>
      <p className="lead text-muted mb-5">
        Izaberite jednu od opcija za upravljanje terminima i istorijom.
      </p>

      <Row xs={1} md={3} className="g-4 justify-content-center">
        {/* Kalendar */}
        <Col>
          <DashboardCard
            icon={<FaCalendarAlt size={36} />}
            title="Pregled kalendara"
            text="Pregledajte sve zakazane, buduće i prošle termine."
            variant="primary"
            onClick={() => navigate("/patient/calendar")}
          />
        </Col>

        {/* Istorija */}
        <Col>
          <DashboardCard
            icon={<FaHistory size={36} />}
            title="Istorija pregleda"
            text="Pristupite detaljnom zapisu svih završenih pregleda."
            variant="secondary"
            onClick={() => navigate("/patient/history")}
          />
        </Col>

        {/* Export ICS */}
        <Col>
          <DashboardCard
            icon={<FaDownload size={36} />}
            title="Preuzmi .ICS fajl"
            text="Preuzmite fajl sa svim terminima i dodajte ih u svoj kalendar."
            variant="success"
            onClick={handleExportICS}
            isLoading={loading}
            disabled={loading}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPatient;
