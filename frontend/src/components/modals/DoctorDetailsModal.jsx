// src/components/DoctorDetailsModal.jsx
import React from "react";
import { Modal, Card, ListGroup, Row, Col, Button, Badge, Spinner } from "react-bootstrap";
import {
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaStar,
  FaClock,
  FaChartBar,
  FaCalendarCheck,
  FaTimesCircle,
  FaBan,
  FaUsers,
} from "react-icons/fa";

const DoctorDetailsModal = ({ show, onHide, doctor, loading }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalji doktora</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {loading || !doctor ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Row className="g-4">
            {/* Osnovni podaci */}
            <Col md={6}>
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-primary text-white d-flex align-items-center">
                  <FaUserMd className="me-2" />
                  <h5 className="mb-0">Osnovni podaci</h5>
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex align-items-center">
                    <FaUserMd className="text-primary me-3" />
                    <div>
                      <strong className="d-block">Ime i prezime:</strong>
                      {doctor.first_name} {doctor.last_name}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex align-items-center">
                    <FaEnvelope className="text-primary me-3" />
                    <div>
                      <strong className="d-block">Email:</strong> {doctor.email}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex align-items-center">
                    <FaPhone className="text-primary me-3" />
                    <div>
                      <strong className="d-block">Telefon:</strong> {doctor.phone}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex align-items-center">
                    <FaStar className="text-primary me-3" />
                    <div>
                      <strong className="d-block">Specijalnost:</strong>
                      <Badge bg="info" className="ms-1">
                        {doctor.specialization || "Nije definisana"}
                      </Badge>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>

            {/* Radno vreme */}
            <Col md={6}>
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-success text-white d-flex align-items-center">
                  <FaClock className="me-2" />
                  <h5 className="mb-0">Radno vreme</h5>
                </Card.Header>
                <ListGroup variant="flush">
                  {doctor.doctor_schedules.length > 0 ? (
                    doctor.doctor_schedules.map((sch, i) => (
                      <ListGroup.Item key={i}>
                        <strong className="me-2">{sch.day_of_week}:</strong>
                        <Badge bg="secondary">
                          {sch.start_time} - {sch.end_time}
                        </Badge>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item className="text-muted">
                      Nije definisano radno vreme.
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>

            {/* Statistika */}
            <Col xs={12}>
              <Card className="shadow-sm">
                <Card.Header className="bg-warning text-dark d-flex align-items-center">
                  <FaChartBar className="me-2" />
                  <h5 className="mb-0">Statistika pregleda</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="text-center g-3">
                    {[
                      { label: "Ukupno termina", value: doctor.appointments_stats.total, color: "primary", icon: null },
                      { label: "Zakazani", value: doctor.appointments_stats.scheduled, color: "success", icon: <FaCalendarCheck className="me-1" /> },
                      { label: "Završeni", value: doctor.appointments_stats.completed, color: "info", icon: <FaStar className="me-1" /> },
                      { label: "Odbijeni", value: doctor.appointments_stats.rejected, color: "danger", icon: <FaTimesCircle className="me-1" /> },
                      { label: "Otkazani", value: doctor.appointments_stats.canceled, color: "secondary", icon: <FaBan className="me-1" /> },
                      { label: "Razl. pacijenti", value: doctor.appointments_stats.distinct_patients, color: "dark", icon: <FaUsers className="me-1" /> },
                    ].map((stat, idx) => (
                      <Col md={4} sm={6} key={idx}>
                        <div className="p-3 border rounded">
                          <h6 className="text-muted mb-1">{stat.label}</h6>
                          <h4 className={`text-${stat.color}`}>
                            {stat.icon} {stat.value}
                          </h4>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Zatvori
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DoctorDetailsModal;
