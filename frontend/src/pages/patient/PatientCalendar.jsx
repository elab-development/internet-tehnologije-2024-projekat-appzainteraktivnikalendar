import React, { useEffect, useState } from "react";
import CalendarComponent from "../../components/CalendarComponent.jsx";
import api from "../../api/api";
import { Modal, Button } from "react-bootstrap";
import "../../styles/Calendar.css";

const PatientCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
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

        const apps = (appsRes.data.appointments || []).map((a) => ({
          id: a.id,
          title: `Dr. ${a.doctor.first_name} ${a.doctor.last_name}`,
          start: a.start_time,
          end: a.end_time,
          color: a.doctor.specialization?.color || "#007bff",
          extendedProps: a, // keep whole appointment in extendedProps
        }));

        const hols = (holRes.data || []).map((h) => ({
          id: `holiday-${h.date}`,
          title: h.localName,
          start: h.date,
          allDay: true,
          color: "#ff7b7b",
          textColor: "#fff",
          // note: holiday has no .doctor
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

  // Handlers called from CalendarComponent
  const handleAppointmentClick = (appointmentExtendedProps, rawEvent) => {
    // appointmentExtendedProps is the original appointment object we stored in extendedProps
    setSelectedAppointment(appointmentExtendedProps);
    setShowAppointmentModal(true);
  };

  const handleHolidayClick = (holidayData, rawEvent) => {
    setSelectedHoliday(holidayData);
    setShowHolidayModal(true);
  };

  const handleDateClick = (info) => {
    // open "create appointment" modal later
    console.log("Kliknuto na datum (patient):", info.dateStr);
  };

  return (
    <div className="calendar-page-container">
      <h2 className="calendar-title">📅 Moj Kalendar Pregleda</h2>

      {loading ? (
        <p className="text-center text-muted">Učitavanje kalendara...</p>
      ) : (
        <CalendarComponent
          events={combinedEvents}
          onDateClick={handleDateClick}
          onAppointmentClick={handleAppointmentClick}
          onHolidayClick={handleHolidayClick}
        />
      )}

      {/* Appointment modal (patient-specific) */}
      <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalji pregleda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment ? (
            <>
              <p><strong>Doktor:</strong> Dr. {selectedAppointment.doctor.first_name} {selectedAppointment.doctor.last_name}</p>
              <p><strong>Specijalizacija:</strong> {selectedAppointment.doctor.specialization?.name || "Opšta praksa"}</p>
              <p><strong>Početak:</strong> {new Date(selectedAppointment.start_time).toLocaleString("sr-RS")}</p>
              <p><strong>Kraj:</strong> {new Date(selectedAppointment.end_time).toLocaleString("sr-RS")}</p>
              <p><strong>Napomena:</strong> {selectedAppointment.note || "Nema napomene."}</p>
            </>
          ) : (
            <p>Nema podataka za ovaj termin.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAppointmentModal(false)}>Zatvori</Button>
        </Modal.Footer>
      </Modal>

      {/* Holiday modal */}
      <Modal show={showHolidayModal} onHide={() => setShowHolidayModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Praznik</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHoliday ? (
            <>
              <p><strong>Naziv:</strong> {selectedHoliday.title}</p>
              <p><strong>Datum:</strong> {selectedHoliday.date}</p>
              <p className="text-muted">Ovo je državni praznik.</p>
            </>
          ) : (
            <p>Nema dodatnih informacija.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHolidayModal(false)}>Zatvori</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PatientCalendar;
