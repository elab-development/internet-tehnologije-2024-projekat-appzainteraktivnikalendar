import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Pagination,
} from "react-bootstrap";
import {
  FaUserMd,
  FaHistory,
  FaCalendarAlt,
  FaClock,
  FaClipboardList,
  FaCheckCircle,
} from "react-icons/fa";
import { format } from "date-fns";
import { srLatn } from "date-fns/locale"; // Import Serbian locale for date-fns
import api from "../../api/api";
import "../../styles/PatientHistory.css";

const PatientHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // --- Data Fetching ---
  useEffect(() => {
    fetchAppointments(page);
  }, [page]);

  const fetchAppointments = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await api.get(`/patient/history?page=${pageNumber}`);
      setAppointments(response.data.data);
      setLastPage(response.data.meta?.last_page || 1);
    } catch (error) {
      console.error("Greška pri učitavanju istorije:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Pagination Handlers ---
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= lastPage) {
      setPage(pageNumber);
    }
  };

  // --- Render Functions ---

  const renderPagination = () => {
    let items = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(lastPage, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Previous Button
    items.push(
      <Pagination.Prev
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        key="prev"
      />
    );

    // Page numbers
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === page}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    // Next Button
    items.push(
      <Pagination.Next
        onClick={() => handlePageChange(page + 1)}
        disabled={page === lastPage}
        key="next"
      />
    );

    return (
      <Pagination className="justify-content-center mt-4 mb-5">
        {items}
      </Pagination>
    );
  };

  // --- Component JSX ---
  return (
    <Container className="my-5">
      <h2 className="mb-5 text-center text-primary fw-bold">
        <FaHistory className="me-2" /> Istorija pregleda
      </h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Učitavanje...</p>
        </div>
      ) : appointments.length === 0 ? (
        <p className="text-center p-5 border rounded bg-light">
          Nema završenih pregleda u istoriji.
        </p>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {appointments.map((app) => (
              <Col key={app.id}>
                <Card className="h-100 shadow-lg border-0 card-hover-effect">
                  <Card.Body>
                    <Card.Title className="mb-2 fw-bold d-flex align-items-center text-dark">
                      <FaUserMd className="me-2 text-primary" />
                      Dr. {app.doctor.first_name} {app.doctor.last_name}
                    </Card.Title>
                    <Card.Subtitle className="mb-3 text-secondary small">
                      {app.doctor.specialization?.name || "Opšta praksa"}
                    </Card.Subtitle>

                    <hr className="my-3 text-light" />

                    <Card.Text className="text-muted">
                      {/* Date Information */}
                      <div className="mb-1">
                        {" "}
                        <strong>
                          <FaCalendarAlt className="me-2 text-success" /> Datum:
                        </strong>{" "}
                        {format(new Date(app.start_time), "dd. MMMM yyyy.", {
                          locale: srLatn,
                        })}
                      </div>
                      <div className="mb-1">
                        {" "}
                        <strong>
                          <FaClock className="me-2 text-info" /> Vreme:
                        </strong>{" "}
                        {format(new Date(app.start_time), "HH:mm", {
                          locale: srLatn,
                        })}{" "}
                        -{" "}
                        {format(new Date(app.end_time), "HH:mm", {
                          locale: srLatn,
                        })}
                      </div>

                      <hr className="my-3 text-light" />

                      {/* Note/Details */}
                      <div className="mb-0">
                        {" "}
                        <strong>
                          <FaClipboardList className="me-2 text-warning" />{" "}
                          Napomena:
                        </strong>
                      </div>
                      <div className="border rounded p-2 mt-1 bg-light small">
                        {app.note || "Nema dodatnih napomena."}
                      </div>
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white border-top-0 pt-0 pb-3 d-flex justify-content-end align-items-center text-success fw-bold small">
                    <FaCheckCircle className="me-2" /> Pregled završen
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination Component */}
          {lastPage > 1 && renderPagination()}
        </>
      )}
    </Container>
  );
};

export default PatientHistory;
