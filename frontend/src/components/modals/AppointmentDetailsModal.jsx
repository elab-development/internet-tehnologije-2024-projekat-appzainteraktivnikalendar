import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaUserMd, FaClock, FaCalendarAlt, FaStickyNote } from "react-icons/fa";

const AppointmentDetailsModal = ({ show, onHide, appointment }) => {
  if (!appointment) return null;

  const doctor = appointment.doctor || {};
  const specialization = doctor.specialization?.name || "Opšta praksa";
  const start = new Date(appointment.start_time).toLocaleString("sr-RS");
  const end = new Date(appointment.end_time).toLocaleString("sr-RS");

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title style={{ fontWeight: 600 }}>Detalji pregleda</Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pb-3">
        <div className="mb-3">
          <p className="mb-1">
            <FaUserMd className="me-2 text-primary" />
            <strong>Doktor:</strong> Dr. {doctor.first_name} {doctor.last_name}
          </p>
          <p className="ms-4 text-muted">{specialization}</p>
        </div>

        <div className="border-top pt-3 mb-3">
          <p className="mb-1">
            <FaCalendarAlt className="me-2 text-secondary" />
            <strong>Početak:</strong> {start}
          </p>
          <p className="mb-1 ms-4">
            <FaClock className="me-2 text-secondary" />
            <strong>Kraj:</strong> {end}
          </p>
        </div>

        <div className="border-top pt-3 mb-2">
          <p className="mb-1">
            <FaStickyNote className="me-2 text-warning" />
            <strong>Napomena:</strong>
          </p>
          <p className="ms-4">{appointment.note || "Nema napomena."}</p>
        </div>

        <div className="border-top pt-3">
          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                textTransform: "capitalize",
                color:
                  appointment.status === "completed"
                    ? "green"
                    : appointment.status === "canceled"
                      ? "red"
                      : "#555",
              }}
            >
              {appointment.status}
            </span>
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onHide}>
          Zatvori
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentDetailsModal;
