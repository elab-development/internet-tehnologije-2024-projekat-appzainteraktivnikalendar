import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import "../styles/Auth.css";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await api.post("/login", formData);
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.role === "patient") navigate("/patient/dashboard");
      else if (response.data.user.role === "doctor")
        navigate("/doctor/dashboard");
      else navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Greška pri prijavi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="auth-page d-flex justify-content-center align-items-center">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="p-4 shadow-lg auth-card">
            <Card.Body>
              <h2 className="text-center mb-4 auth-title">Prijava</h2>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Unesite email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Lozinka</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Unesite lozinku"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Prijava...
                      </>
                    ) : (
                      "Prijavi se"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
