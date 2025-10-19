// src/pages/AdminViewDoctors.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Form,
  Row,
  Col
} from "react-bootstrap";
import api from "../../api/api";
import "../../styles/DoctorAppointments.css";
import Searchbar from "../../components/Searchbar";
import DoctorDetailsModal from "../../components/modals/DoctorDetailsModal";

const AdminViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchDoctors = async (
    pageNum = 1,
    searchTerm = "",
    specialtyId = ""
  ) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/doctors", {
        params: {
          search: searchTerm || undefined,
          specialty_id: specialtyId || undefined,
          page: pageNum,
        },
      });
      setDoctors(res.data.data);
      setPage(res.data.meta.current_page);
      setLastPage(res.data.meta.last_page);
    } catch (err) {
      console.error(err);
      setError("Greška pri učitavanju doktora.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const res = await api.get("/admin/specializations");
      setSpecialties(res.data.specializations);
    } catch (err) {
      console.error("Greška pri učitavanju specijalnosti:", err);
    }
  };

  const handleShowDetails = async (id) => {
    setShowModal(true);
    setModalLoading(true);
    try {
      const res = await api.get(`/admin/doctors/${id}`);
      setSelectedDoctor(res.data.data);
    } catch (err) {
      alert("Greška pri učitavanju detalja doktora.");
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
    fetchDoctors();
  }, []);

  // debounce search + filter
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDoctors(1, search, specialty);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, specialty]);

  return (
    <div className="doctor-appointments-container">
      <h2 className="mb-4">Pregled doktora</h2>

      <Row className="mb-3 g-2">
        <Col md={8}>
          <Searchbar
            value={search}
            onChange={(val) => setSearch(val)}
            onClear={() => {
              setSearch("");
              fetchDoctors(1, "", specialty);
            }}
            placeholder="Pretraga: ime, prezime, email ili telefon"
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          >
            <option value="">Sve specijalnosti</option>
            {specialties.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table responsive className="table-modern">
        <thead>
          <tr>
            <th>Ime i prezime</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Specijalnost</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                <Spinner animation="border" variant="primary" />
              </td>
            </tr>
          ) : doctors.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                Nema doktora
              </td>
            </tr>
          ) : (
            doctors.map((doc) => (
              <tr key={doc.id}>
                <td>
                  {doc.first_name} {doc.last_name}
                </td>
                <td>{doc.email}</td>
                <td>{doc.phone}</td>
                <td>{doc.specialization.name || "-"}</td>
                <td>
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => handleShowDetails(doc.id)}
                  >
                    Detalji
                  </Button>
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
          onClick={() => fetchDoctors(1, search, specialty)}
        >
          &laquo; Prva
        </Button>
        <Button
          size="sm"
          disabled={page === 1}
          onClick={() => fetchDoctors(page - 1, search, specialty)}
        >
          &lsaquo; Prethodna
        </Button>
        <span className="align-self-center">
          Strana {page} od {lastPage}
        </span>
        <Button
          size="sm"
          disabled={page === lastPage}
          onClick={() => fetchDoctors(page + 1, search, specialty)}
        >
          Sledeća &rsaquo;
        </Button>
        <Button
          size="sm"
          disabled={page === lastPage}
          onClick={() => fetchDoctors(lastPage, search, specialty)}
        >
          Poslednja &raquo;
        </Button>
      </div>

      {/* Modal */}
      <DoctorDetailsModal
        show={showModal}
        onHide={() => setShowModal(false)}
        doctor={selectedDoctor}
        loading={modalLoading}
      />
    </div>
  );
};

export default AdminViewDoctors;
