import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Tabs,
  Tab,
  InputGroup,
} from "react-bootstrap";
import {
  FaUserPlus,
  FaClock,
  FaCheckCircle,
  FaStar,
  FaArrowRight,
  FaPhoneAlt,
  FaSave,
} from "react-icons/fa";
import api from "../../api/api";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const dayNames = {
  monday: "Ponedeljak",
  tuesday: "Utorak",
  wednesday: "Sreda",
  thursday: "Četvrtak",
  friday: "Petak",
  saturday: "Subota",
  sunday: "Nedelja",
};

// Funkcija za generisanje opcija vremena (00 ili 30 min)
const generateTimeOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    const hour = h.toString().padStart(2, "0");
    options.push(`${hour}:00`);
    options.push(`${hour}:30`);
  }
  return options;
};
const TIME_OPTIONS = generateTimeOptions();

const AdminAddDoctor = () => {
  // --- STATE ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [specialties, setSpecialties] = useState([]);

  const [schedules, setSchedules] = useState(
    daysOfWeek.reduce(
      (acc, day) => ({
        ...acc,
        [day]: { active: false, start: "08:00", end: "16:00" },
      }),
      {}
    )
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  // --- EFEKTI I LOGIKA ---

  // Dohvatanje specijalizacija
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await api.get("/admin/specializations");
        setSpecialties(res.data.specializations);
      } catch (err) {
        console.error("Greška pri učitavanju specijalnosti:", err);
      }
    };
    fetchSpecialties();
  }, []);

  const handleScheduleToggle = (day) => {
    setSchedules((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        active: !prev[day].active,
      },
    }));
  };

  const handleScheduleChange = (day, field, value) => {
    setSchedules((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setSpecialtyId("");
    setSchedules(
      daysOfWeek.reduce(
        (acc, day) => ({
          ...acc,
          [day]: { active: false, start: "08:00", end: "16:00" },
        }),
        {}
      )
    );
    setActiveTab("info");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const schedulesArray = Object.entries(schedules)
      .filter(([_, times]) => times.active && times.start && times.end)
      .map(([day, times]) => ({
        day_of_week: day,
        start_time: times.start,
        end_time: times.end,
      }));

    try {
      const res = await api.post("/admin/doctors", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone,
        specialty_id: specialtyId || null,
        schedules: schedulesArray.length > 0 ? schedulesArray : null,
      });

      setSuccess("Doktor uspešno dodat!");
      resetForm();
    } catch (err) {
      const message =
        err.response?.data?.message || "Greška pri dodavanju doktora.";
      const errors = err.response?.data?.errors;
      if (errors) {
        const errorMessages = Object.values(errors).flat();
        // Prikaz Laravel validacionih grešaka u Alertu
        setError(message + " Detalji: " + errorMessages.join("; "));
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERING KOMPONENTE ---

  return (
    <Card className="shadow-lg border-0">
      <Card.Header className="bg-light border-bottom">
        <h4 className="mb-0 text-primary fw-bold">
          <FaUserPlus className="me-2" />
          Novi Doktor - Unos podataka
        </h4>
      </Card.Header>

      <Card.Body className="p-4 p-md-5">
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="mb-4">
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4 custom-tabs"
            variant="underline"
          >
            {/* ---------------------------------------------------- */}
            {/* TAB 1: LIČNI PODACI */}
            {/* ---------------------------------------------------- */}
            <Tab
              eventKey="info"
              title={
                <span className="fw-bold">
                  <FaUserPlus className="me-2 text-primary" /> Osnovni Podaci
                </span>
              }
            >
              <p className="text-muted mt-3 mb-4">
                Molimo unesite lične podatke i kredencijale za prijavu. Polja
                označena sa <span className="text-danger">*</span> su obavezna.
              </p>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Ime <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Prezime <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Email <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Telefon <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaPhoneAlt />
                      </InputGroup.Text>
                      <Form.Control
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Specijalnost <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaStar />
                      </InputGroup.Text>
                      <Form.Select
                        value={specialtyId}
                        onChange={(e) => setSpecialtyId(e.target.value)}
                        required
                      >
                        <option value="">Izaberite specijalnost</option>
                        {specialties.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Lozinka <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end mt-4">
                <Button
                  variant="primary"
                  onClick={() => setActiveTab("schedule")}
                >
                  Dalje na Radno Vreme <FaArrowRight className="ms-2" />
                </Button>
              </div>
            </Tab>

            {/* ---------------------------------------------------- */}
            {/* TAB 2: RADNO VREME */}
            {/* ---------------------------------------------------- */}
            <Tab
              eventKey="schedule"
              title={
                <span className="fw-bold">
                  <FaClock className="me-2 text-primary" /> Radno Vreme
                </span>
              }
            >
              <h5 className="mt-3 mb-4 text-primary">Definisanje Rasporeda</h5>
              <p className="text-muted mb-4">
                Aktivirajte dane u kojima doktor radi i postavite
                početno/krajnje vreme. Vreme se unosi u intervalima od 30
                minuta.
              </p>

              {daysOfWeek.map((day) => {
                const schedule = schedules[day];
                const isActive = schedule.active;

                return (
                  <Card
                    key={day}
                    className={`mb-3 ${isActive ? "border-primary shadow-sm" : "border-light"}`}
                  >
                    <Card.Body className="p-3">
                      <Row className="align-items-center">
                        {/* Kolona 1: Ime Dana i Prekidač */}
                        <Col md={3} className="d-flex align-items-center">
                          <Form.Check
                            type="switch"
                            id={`schedule-switch-${day}`}
                            label={
                              <strong
                                className={
                                  isActive ? "text-primary" : "text-secondary"
                                }
                              >
                                {dayNames[day]}
                              </strong>
                            }
                            checked={isActive}
                            onChange={() => handleScheduleToggle(day)}
                          />
                          {isActive && (
                            <FaCheckCircle
                              className="text-success ms-2"
                              size={16}
                            />
                          )}
                        </Col>

                        {/* Kolona 2: Vreme od/do */}
                        <Col md={9}>
                          {isActive ? (
                            <Row className="g-2">
                              <Col xs={5}>
                                <InputGroup>
                                  <InputGroup.Text className="bg-white border-end-0">
                                    Od
                                  </InputGroup.Text>
                                  <Form.Select
                                    value={schedule.start}
                                    onChange={(e) =>
                                      handleScheduleChange(
                                        day,
                                        "start",
                                        e.target.value
                                      )
                                    }
                                  >
                                    {TIME_OPTIONS.map((time) => (
                                      <option
                                        key={`${day}-start-${time}`}
                                        value={time}
                                      >
                                        {time}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </InputGroup>
                              </Col>
                              <Col
                                xs={1}
                                className="text-center d-flex align-items-center justify-content-center fw-bold"
                              >
                                -
                              </Col>
                              <Col xs={6}>
                                <InputGroup>
                                  <InputGroup.Text className="bg-white border-end-0">
                                    Do
                                  </InputGroup.Text>
                                  <Form.Select
                                    value={schedule.end}
                                    onChange={(e) =>
                                      handleScheduleChange(
                                        day,
                                        "end",
                                        e.target.value
                                      )
                                    }
                                  >
                                    {/* Filtrira opcije: kraj mora biti posle početka */}
                                    {TIME_OPTIONS.filter(
                                      (time) => time > schedule.start
                                    ).map((time) => (
                                      <option
                                        key={`${day}-end-${time}`}
                                        value={time}
                                      >
                                        {time}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </InputGroup>
                              </Col>
                            </Row>
                          ) : (
                            <div className="text-muted fst-italic py-2">
                              Nema definisanog rasporeda za ovaj dan.
                            </div>
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                );
              })}
            </Tab>
          </Tabs>

          <Button
            type="submit"
            variant="primary"
            className="mt-5 w-100 shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Čuvanje...
              </>
            ) : (
              <>
                {/* Koristimo FaSave sa plavim akcentom */}
                <FaSave className="me-2" /> Potvrdi i Dodaj Doktora
              </>
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AdminAddDoctor;
