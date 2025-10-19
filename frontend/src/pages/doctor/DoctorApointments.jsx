// src/pages/DoctorAppointments.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import api from "../../api/api";
import "../../styles/DoctorAppointments.css";
import SearchBar from "../../components/Searchbar";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  // Reject state
  const [rejectingId, setRejectingId] = useState(null);

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const fetchAppointments = async (pageNum = 1, searchTerm = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/doctor/appointments", {
        params: { search: searchTerm || undefined, page: pageNum },
      });
      setAppointments(res.data.data);
      setPage(res.data.meta.current_page);
      setLastPage(res.data.meta.last_page);
    } catch (err) {
      console.error(err);
      setError("Greška pri učitavanju termina.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAppointments(1, search);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleReject = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite odbiti ovaj termin?"))
      return;

    setRejectingId(id);
    try {
      await api.post(`/doctor/appointments/${id}/reject`);
      fetchAppointments(page, search);
      setToast({
        show: true,
        message: "Termin uspešno odbijen.",
        variant: "success",
      });
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Greška pri odbijanju termina.",
        variant: "danger",
      });
    } finally {
      setRejectingId(null);
    }
  };

  const handleCompleteOpen = (id) => {
    setSelectedId(id);
    setNote("");
    setModalError("");
    setShowModal(true);
  };

  const handleCompleteSubmit = async () => {
    if (!selectedId) return;
    setSubmitting(true);
    setModalError("");
    try {
      await api.post(`/doctor/appointments/${selectedId}/complete`, { note });
      setShowModal(false);
      setNote("");
      fetchAppointments(page, search);
      setToast({
        show: true,
        message: "Napomena uspešno sačuvana.",
        variant: "success",
      });
    } catch (err) {
      setModalError(
        err.response?.data?.message || "Greška pri završavanju termina."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isPast = (dateStr) => new Date(dateStr) < new Date();

  return (
    <div className="doctor-appointments-container">
      <h2 className="mb-4">Zakazani pregledi</h2>

      <SearchBar
        value={search}
        onChange={(val) => setSearch(val)}
        onClear={() => {
          setSearch("");
          fetchAppointments(1, "");
        }}
        placeholder="Pretraga pacijenta: ime, prezime ili email"
      />

      {error && <Alert variant="danger">{error}</Alert>}

      <Table responsive className="table-modern">
        <thead>
          <tr>
            <th>Pacijent</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Datum i vreme</th>
            <th>Status</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                <Spinner animation="border" variant="primary" />
              </td>
            </tr>
          ) : appointments.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                Nema zakazanih termina
              </td>
            </tr>
          ) : (
            appointments.map((app) => (
              <tr
                key={app.id}
                className={
                  isPast(app.start_time) && !app.note ? "needs-note" : ""
                }
              >
                <td>
                  {app.patient.first_name} {app.patient.last_name}
                </td>
                <td>{app.patient.email}</td>
                <td>{app.patient.phone}</td>
                <td>{new Date(app.start_time).toLocaleString()}</td>
                <td>{app.status}</td>
                <td>
                  {isPast(app.start_time) && !app.note ? (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleCompleteOpen(app.id)}
                    >
                      Dodaj napomenu
                    </Button>
                  ) : !isPast(app.start_time) ? (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleReject(app.id)}
                      disabled={rejectingId === app.id}
                    >
                      {rejectingId === app.id ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Odbijanje...
                        </>
                      ) : (
                        "Odbij termin"
                      )}
                    </Button>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="pagination-wrapper mt-3 d-flex justify-content-center gap-2">
        <Button
          size="sm"
          disabled={page === 1}
          onClick={() => fetchAppointments(1, search)}
        >
          &laquo; Prva
        </Button>
        <Button
          size="sm"
          disabled={page === 1}
          onClick={() => fetchAppointments(page - 1, search)}
        >
          &lsaquo; Prethodna
        </Button>
        <span className="align-self-center">
          Strana {page} od {lastPage}
        </span>
        <Button
          size="sm"
          disabled={page === lastPage}
          onClick={() => fetchAppointments(page + 1, search)}
        >
          Sledeća &rsaquo;
        </Button>
        <Button
          size="sm"
          disabled={page === lastPage}
          onClick={() => fetchAppointments(lastPage, search)}
        >
          Poslednja &raquo;
        </Button>
      </div>

      {/* Modal for note */}
      <Modal
        show={showModal}
        onHide={() => !submitting && setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Dodaj napomenu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError && (
            <Alert
              variant="danger"
              onClose={() => setModalError("")}
              dismissible
            >
              {modalError}
            </Alert>
          )}
          <Form.Group controlId="note">
            <Form.Label>Napomena</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Unesite napomenu o pregledu..."
              disabled={submitting}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            disabled={submitting}
          >
            Otkaži
          </Button>
          <Button
            variant="success"
            onClick={handleCompleteSubmit}
            disabled={submitting || !note.trim()}
          >
            {submitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Čuvanje...
              </>
            ) : (
              "Sačuvaj"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setToast({ ...toast, show: false })}
          show={toast.show}
          delay={3000}
          autohide
          bg={toast.variant}
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default DoctorAppointments;
