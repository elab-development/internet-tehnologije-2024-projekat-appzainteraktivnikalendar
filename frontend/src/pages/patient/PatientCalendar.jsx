import React, { useEffect, useState } from "react";
import CalendarComponent from "../../components/CalendarComponent.jsx";
import api from "../../api/api";
import { Modal, Button, Spinner } from "react-bootstrap";
import AppointmentCreateModal from "../../components/modals/AppointmentCreateModal.jsx";
import AppointmentDetailsModal from "../../components/modals/AppointmentDetailsModal.jsx";
import AppointmentEditModal from "../../components/modals/AppointmentEditModal.jsx";
import "../../styles/Calendar.css";

const PatientCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  // --- Fetch funkcije ---
  const fetchAppointments = async () => {
    try {
      const res = await api.get("/patient/appointments");
      const now = new Date();

      const apps = (res.data.appointments || []).map((a) => {
        const startTime = new Date(a.start_time);
        const color =
          startTime < now
            ? "#b0b0b0"
            : a.doctor.specialization?.color || "#007bff";

        return {
          id: a.id,
          title: `Dr. ${a.doctor.first_name} ${a.doctor.last_name}`,
          start: a.start_time,
          end: a.end_time,
          color,
          extendedProps: a,
        };
      });

      setAppointments(apps);
    } catch (err) {
      console.error("Greška pri učitavanju termina:", err);
    }
  };

  const fetchHolidays = async () => {
    try {
      const res = await api.get("/public-holidays");
      const hols = (res.data || []).map((h) => ({
        id: `holiday-${h.date}`,
        title: h.localName,
        start: h.date,
        allDay: true,
        color: "#ff7b7b",
        textColor: "#fff",
        holidayRaw: h,
      }));
      setHolidays(hols);
    } catch (err) {
      console.error("Greška pri učitavanju praznika:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAppointments(), fetchHolidays()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const combinedEvents = [...appointments, ...holidays];

  // --- Event handlers ---
  const handleAppointmentClick = (appointmentExtendedProps) => {
    if (!appointmentExtendedProps) return;

    const now = new Date();
    const start = new Date(appointmentExtendedProps.start_time);
    const status = appointmentExtendedProps.status;

    setSelectedAppointment(appointmentExtendedProps);

    if (status === "completed" || start < now) {
      setShowDetailsModal(true);
    } else {
      setShowEditModal(true);
    }
  };

  const handleHolidayClick = (holidayData) => {
    setSelectedHoliday(holidayData);
    setShowHolidayModal(true);
  };

  const handleDateClick = (info) => {
    const clickedDate = new Date(info.dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (clickedDate > today) {
      setSelectedDate(info.dateStr);
      setShowCreateModal(true);
    } else {
      alert("Možete zakazati pregled samo za buduće datume.");
    }
  };

  // --- Render ---
  return (
    <div className="calendar-page-container">
      <h2 className="calendar-title">📅 Moj Kalendar Pregleda</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Učitavanje...</p>
        </div>
      ) : (
        <CalendarComponent
          events={combinedEvents}
          onDateClick={handleDateClick}
          onAppointmentClick={handleAppointmentClick}
          onHolidayClick={handleHolidayClick}
        />
      )}

      {/* Praznici modal */}
      <Modal
        show={showHolidayModal}
        onHide={() => setShowHolidayModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Praznik</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHoliday ? (
            <>
              <p>
                <strong>Naziv:</strong> {selectedHoliday.title}
              </p>
              <p>
                <strong>Datum:</strong> {selectedHoliday.date}
              </p>
              <p className="text-muted">Ovo je državni praznik.</p>
            </>
          ) : (
            <p>Nema dodatnih informacija.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowHolidayModal(false)}
          >
            Zatvori
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Novi modali */}
      <AppointmentCreateModal
        show={showCreateModal}
        date={selectedDate}
        onHide={() => setShowCreateModal(false)}
        onSuccess={fetchAppointments} // refresh nakon kreiranja
      />
      <AppointmentDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        appointment={selectedAppointment}
      />
      <AppointmentEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        appointment={selectedAppointment}
        onSuccess={fetchAppointments} // refresh nakon editovanja
      />
    </div>
  );
};

export default PatientCalendar;
