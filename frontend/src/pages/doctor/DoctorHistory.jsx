// src/pages/doctor/DoctorHistory.jsx
import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Pagination } from "react-bootstrap";
import api from "../../api/api";
import Searchbar from "../../components/Searchbar";
import "../../styles/DoctorHistory.css";

const DoctorHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const doFetchAppointments = async (pageNumber, searchTerm) => {
    setLoading(true);
    try {
      const res = await api.get("/doctor/history", {
        params: { page: pageNumber, search: searchTerm },
      });
      setAppointments(res.data.data || []);
      setPage(res.data.meta.current_page);
      setLastPage(res.data.meta.last_page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    doFetchAppointments(page, search);
  }, [page, search]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
  };

  const changePage = (pageNumber) => {
    setPage(pageNumber);
  };

  const renderPagination = () => {
    if (lastPage <= 1) return null;

    const items = [];

    // Prva stranica
    items.push(
      <Pagination.First
        key="first"
        onClick={() => changePage(1)}
        disabled={page === 1}
      />
    );

    // Prethodna stranica
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => {
          if (page > 1) {
            changePage(page - 1);
          }
        }}
        disabled={page === 1}
      />
    );

    // Numeričke stranice (prikaz 5 stranica u blizini trenutne)
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(lastPage, page + 2);

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === page}
          onClick={() => changePage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    // Sledeća stranica
    items.push(
      <Pagination.Next
        key="next"
        onClick={() => {
          if (page < lastPage) {
            changePage(page + 1);
          }
        }}
        disabled={page === lastPage}
      />
    );

    // Poslednja stranica
    items.push(
      <Pagination.Last
        key="last"
        onClick={() => changePage(lastPage)}
        disabled={page === lastPage}
      />
    );

    return <Pagination>{items}</Pagination>;
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Istorija pregleda</h2>

      <Searchbar
        value={search}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
        placeholder="Pretraga pacijenta: ime, prezime ili email"
      />

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="table-modern">
          <thead>
            <tr>
              <th>Pacijent</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Datum i vreme</th>
              <th>Napomena</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Nema završenih pregleda
                </td>
              </tr>
            ) : (
              appointments.map((a) => (
                <tr key={a.id}>
                  <td>
                    {a.patient.first_name} {a.patient.last_name}
                  </td>
                  <td>{a.patient.email}</td>
                  <td>{a.patient.phone}</td>
                  <td>{new Date(a.start_time).toLocaleString()}</td>
                  <td>{a.note || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {renderPagination()}
    </Container>
  );
};

export default DoctorHistory;
