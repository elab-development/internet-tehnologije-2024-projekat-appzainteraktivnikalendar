import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { FaClock, FaCalendarAlt, FaUserMd, FaTrashAlt } from "react-icons/fa";
import api from "../../api/api";

const AppointmentEditModal = ({ show, onHide, appointment, onSuccess }) => {
  const [times, setTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!show || !appointment) return;

    // Reset pri svakom otvaranju
    setTimes([]);
    setSelectedTime("");
    setError("");
    setSuccessMessage("");

    const date = appointment.start_time.split("T")[0];

    const fetchTimes = async () => {
      setLoadingTimes(true);
      try {
        const res = await api.get(
          `/patient/doctors/${appointment.doctor.id}/available-times`,
          { params: { date } }
        );
        setTimes(res.data.available_times || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Greška pri učitavanju slobodnih termina."
        );
      } finally {
        setLoadingTimes(false);
      }
    };

    fetchTimes();
  }, [show, appointment]);

  const handleUpdate = async () => {
    if (!selectedTime) {
      setError("Molimo izaberite novo vreme.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    const baseDate = appointment.start_time.split("T")[0]; // "2025-10-22"
    const newStartTime = `${baseDate} ${selectedTime}`; // "2025-10-22 10:00"

    try {
      const res = await api.put(`/patient/appointments/${appointment.id}`, {
        new_start_time: newStartTime,
      });

      setSuccessMessage("Termin je uspešno izmenjen.");
      onSuccess && onSuccess(res.data);

      setTimeout(() => {
        onHide();
        setSubmitting(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Greška pri izmeni termina.");
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Da li ste sigurni da želite da otkažete termin?"))
      return;

    setCanceling(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await api.post(
        `/patient/appointments/${appointment.id}/cancel`
      );
      setSuccessMessage("Termin je uspešno otkazan.");
      onSuccess && onSuccess(res.data.appointment);

      setTimeout(() => {
        onHide();
        setCanceling(false);
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Greška pri otkazivanju termina."
      );
    }
  };

  if (!appointment) return null;

  const date = new Date(appointment.start_time).toLocaleDateString("sr-RS", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const currentTime = new Date(appointment.start_time).toLocaleTimeString(
    "sr-RS",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontWeight: 600 }}>
          Uređivanje termina
        </Modal.Title>
      </Modal.Header>
      <div className="px-4 pt-0 pb-2">
        <p className="text-muted mb-0 d-flex align-items-center">
          <FaCalendarAlt className="me-2 text-secondary" />
          <strong style={{ fontWeight: 500 }}>Datum: {date}</strong>
        </p>
      </div>
      <Modal.Body className="px-4 pb-3 pt-0">
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <p className="mb-2">
          <FaUserMd className="me-2 text-primary" />
          <strong>
            Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}
          </strong>
        </p>
        <p className="text-muted mb-4">
          Specijalizacija: {appointment.doctor.specialization?.name}
        </p>

        <Form.Group className="mb-3">
          <Form.Label>
            <FaClock className="me-2 text-primary" />
            Novo vreme
          </Form.Label>
          {loadingTimes ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <Form.Select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">Izaberite novo vreme</option>
              {times.map((t) => (
                <option key={t} value={t}>
                  {t} {t === currentTime ? "(trenutno)" : ""}
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="border-0 d-flex justify-content-between">
        <Button
          variant="danger"
          onClick={handleCancel}
          disabled={canceling || submitting}
        >
          {canceling ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Otkazivanje...
            </>
          ) : (
            <>
              <FaTrashAlt className="me-2" />
              Otkaži termin
            </>
          )}
        </Button>

        <div>
          <Button
            variant="secondary"
            onClick={onHide}
            disabled={submitting || canceling}
          >
            Zatvori
          </Button>
          <Button
            variant="primary"
            className="ms-2"
            onClick={handleUpdate}
            disabled={submitting || canceling || !selectedTime}
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Čuvanje...
              </>
            ) : (
              "Sačuvaj promene"
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentEditModal;
