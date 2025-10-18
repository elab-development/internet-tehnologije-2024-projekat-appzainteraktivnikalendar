import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import {
  FaUserMd,
  FaStethoscope,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa"; // Dodao FaCalendarAlt
import api from "../../api/api";

const AppointmentCreateModal = ({ show, onHide, date, onSuccess }) => {
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [times, setTimes] = useState([]);

  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Funkcija za formatiranje datuma YYYY-MM-DD u format za prikaz
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Nije izabran datum";
    try {
      // Pretpostavljamo da je dateString u formatu "YYYY-MM-DD"
      const [year, month, day] = dateString.split("-");
      console.log(dateString);

      // Kreiranje Date objekta (koristeći UTC da se izbegne lokalni offset
      // pri konverziji iz stringa bez vremena, ali ovde nam treba samo formatiranje)
      const d = new Date(dateString);
      // Najbolje je koristiti toLocaleDateString za ispravan regionalni format
      return d.toLocaleDateString("sr-RS", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      console.error("Greška pri formatiranju datuma:", e);
      return dateString; // Vrati neformatirani string ako dođe do greške
    }
  };

  // 1. Kada se modal otvori/zatvori ili promeni datum
  useEffect(() => {
    if (!show) return;

    // Resetuj sve kada se modal otvori
    setSpecializations([]);
    setDoctors([]);
    setTimes([]);
    setSelectedSpecialization("");
    setSelectedDoctor("");
    setSelectedTime("");
    setError("");
    setSuccessMessage("");

    const fetchSpecializations = async () => {
      setLoadingSpecs(true);
      try {
        const res = await api.get("/patient/available-specializations", {
          params: { date },
        });
        setSpecializations(res.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Greška pri učitavanju specijalizacija."
        );
        setSpecializations([]);
      } finally {
        setLoadingSpecs(false);
      }
    };

    fetchSpecializations();
  }, [show, date]);

  // 2. Kada se izabere specijalizacija → učitaj doktore
  useEffect(() => {
    if (!show || !selectedSpecialization) return;

    setDoctors([]);
    setSelectedDoctor("");
    setTimes([]);
    setSelectedTime("");

    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const res = await api.get("/patient/available-doctors", {
          params: { date, specialization_id: selectedSpecialization },
        });
        setDoctors(res.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Greška pri učitavanju doktora."
        );
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [selectedSpecialization, date, show]);

  // 3. Kada se izabere doktor → učitaj dostupna vremena
  useEffect(() => {
    if (!show || !selectedDoctor) return;

    setTimes([]);
    setSelectedTime("");

    const fetchTimes = async () => {
      setLoadingTimes(true);
      try {
        const res = await api.get(
          `/patient/doctors/${selectedDoctor}/available-times`,
          {
            params: { date },
          }
        );
        setTimes(res.data.available_times || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Greška pri učitavanju vremena."
        );
        setTimes([]);
      } finally {
        setLoadingTimes(false);
      }
    };

    fetchTimes();
  }, [selectedDoctor, date, show]);

  const handleSubmit = async () => {
    if (!selectedSpecialization || !selectedDoctor || !selectedTime) {
      setError("Molimo izaberite specijalizaciju, doktora i vreme.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const startTime = `${date} ${selectedTime}`;
      const res = await api.post("/patient/appointments", {
        doctor_id: selectedDoctor,
        start_time: startTime,
      });
      setSuccessMessage("Termin uspešno zakazan!");
      onSuccess && onSuccess(res.data.appointment);

      // KLJUČNO RESETOVANJE STANJA NAKON USPEHA
      setSelectedSpecialization("");
      setSelectedDoctor("");
      setSelectedTime("");
      setDoctors([]);
      setTimes([]);

      // Zatvori modal posle 1.5s
      setTimeout(() => {
        onHide();
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Greška pri zakazivanju termina."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontWeight: 600 }}>
          Zakazivanje pregleda
        </Modal.Title>
      </Modal.Header>

      {/* PRIKAZ IZABRANOG DATUMA */}
      <div className="px-4 pt-0 pb-2">
        <p className="text-muted mb-0 d-flex align-items-center">
          <FaCalendarAlt
            className="me-2 text-secondary"
            style={{ fontSize: "1.1em" }}
          />
          <strong style={{ fontWeight: 500 }}>
            Za datum: {formatDateForDisplay(date)}
          </strong>
        </p>
      </div>
      {/* KRAJ PRIKAZA DATUMA */}

      <Modal.Body className="px-4 pb-3 pt-0">
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        {/* Specijalizacija */}
        <Form.Group className="mb-3">
          <Form.Label>
            <FaStethoscope className="me-2 text-primary" />
            Specijalizacija
          </Form.Label>
          {loadingSpecs ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <Form.Select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
            >
              <option value="">Izaberite specijalizaciju</option>
              {specializations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>

        {/* Doktor */}
        <Form.Group className="mb-3">
          <Form.Label>
            <FaUserMd className="me-2 text-primary" />
            Doktor
          </Form.Label>
          {loadingDoctors ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <Form.Select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              disabled={
                !selectedSpecialization ||
                loadingDoctors ||
                doctors.length === 0
              }
            >
              <option value="">Izaberite doktora</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.first_name} {d.last_name}
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>

        {/* Vreme */}
        <Form.Group className="mb-3">
          <Form.Label>
            <FaClock className="me-2 text-primary" />
            Vreme
          </Form.Label>
          {loadingTimes ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <Form.Select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={!selectedDoctor || loadingTimes || times.length === 0}
            >
              <option value="">Izaberite vreme</option>
              {times.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onHide} disabled={submitting}>
          Zatvori
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={submitting || !selectedTime}
        >
          {submitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Zakazivanje...
            </>
          ) : (
            "Zakazi termin"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentCreateModal;
