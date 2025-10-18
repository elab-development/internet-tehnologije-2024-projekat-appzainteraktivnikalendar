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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, holRes] = await Promise.all([
          api.get("/patient/appointments"),
          api.get("/public-holidays"),
        ]);

        const now = new Date();

        const apps = (appsRes.data.appointments || []).map((a) => {
          const startTime = new Date(a.start_time);
          const isPast = startTime < now;
          const color = isPast
            ? "#b0b0b0" // siva za prošle termine
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

        const hols = (holRes.data || []).map((h) => ({
          id: `holiday-${h.date}`,
          title: h.localName,
          start: h.date,
          allDay: true,
          color: "#ff7b7b",
          textColor: "#fff",
          holidayRaw: h,
        }));

        setAppointments(apps);
        setHolidays(hols);
      } catch (error) {
        console.error("Greška pri učitavanju kalendara:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const combinedEvents = [...appointments, ...holidays];

  // Klik na event (pregled). CalendarComponent šalje (ext, infoEvent)
  const handleAppointmentClick = (appointmentExtendedProps, rawEvent) => {
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

  // Klik na praznik
  const handleHolidayClick = (holidayData, rawEvent) => {
    setSelectedHoliday(holidayData);
    setShowHolidayModal(true);
  };

  // Klik na datum
  const handleDateClick = (info) => {
    const clickedDate = new Date(info.dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (clickedDate > today) {
      setShowCreateModal(true);
    } else {
      // umesto alert možeš prikazati toast ili neku poruku u UI
      alert("Možete zakazati pregled samo za buduće datume.");
    }
  };

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

      {/* === Praznici (ostaje isto) === */}
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

      {/* === Novi modali === */}
      <AppointmentCreateModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
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
      />
    </div>
  );
};

export default PatientCalendar;
