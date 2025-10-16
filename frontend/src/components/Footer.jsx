// src/components/Footer.jsx
import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-light text-center py-3 mt-5">
      <Container>
        <p className="mb-0">© 2025 Sinergija Zdravlja. Sva prava zadržana.</p>
        <p className="mb-0">Kontakt: info@SinergijaZdravlja.rs | +381 11 1234567</p>
      </Container>
    </footer>
  );
};

export default Footer;
