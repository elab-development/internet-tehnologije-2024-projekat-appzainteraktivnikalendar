// src/components/Footer.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-md-start text-center mb-2 mb-md-0">
            <h5>Sinergija Zdravlja</h5>
            <p className="mb-0">© 2025 Sva prava zadržana</p>
          </Col>
          <Col md={6} className="text-md-end text-center">
            <p className="mb-1">
              <FaEnvelope className="me-2" />
              info@SinergijaZdravlja.rs
            </p>
            <p className="mb-0">
              <FaPhone className="me-2" />
              +381 11 1234567
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
