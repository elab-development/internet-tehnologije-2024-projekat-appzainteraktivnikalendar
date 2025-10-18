// src/pages/HomePage.jsx
import React from "react";
import Footer from "../components/Footer";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaStethoscope, FaHeartbeat, FaTooth } from "react-icons/fa";
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <>

      {/* HERO SEKCIJA */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Dobrodošli u Sinergiju Zdravlja</h1>
          <p>
            Moderno zakazivanje pregleda i pregled rasporeda u realnom vremenu.
            Brzo, pregledno i jednostavno.
          </p>
        </div>
      </div>

      {/* O NAMA */}
      <Container className="mt-5">
        <h2 className="text-center mb-4">O nama</h2>
        <Row className="align-items-center">
          <Col md={6}>
            <p>
              Sinergija Zdravlja je moderna klinika posvećena vašem zdravlju i
              dobrobiti. Naš stručni tim lekara i medicinskog osoblja pruža
              profesionalnu i prijateljsku uslugu.
            </p>
            <p>
              Ponosni smo na našu posvećenost pacijentima, kvalitet usluga i
              korišćenje najnovije tehnologije. Bez obzira da li vam je potreban
              rutinski pregled ili specijalistički tretman, mi smo tu za vas.
            </p>
          </Col>
          <Col md={6}>
            <img
              src="clinic-onama.jpg"
              alt="Klinika"
              className="img-fluid rounded shadow"
            />
          </Col>
        </Row>
      </Container>

      {/* NAŠE USLUGE */}
      <Container className="mt-5">
        <h2 className="text-center mb-4">Naše specijalizacije</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card data-aos="fade-up" className="text-center shadow-hover p-3">
              <FaStethoscope size={50} className="mb-3" />
              <Card.Title>Kardiologija</Card.Title>
              <Card.Text>Pregledi srca i krvnih sudova.</Card.Text>
            </Card>
          </Col>
          <Col md={4}>
            <Card data-aos="fade-up" className="text-center shadow-hover p-3">
              <FaHeartbeat size={50} className="mb-3" />
              <Card.Title>Dermatologija</Card.Title>
              <Card.Text>Lečenje kože i kozmetički tretmani.</Card.Text>
            </Card>
          </Col>
          <Col md={4}>
            <Card data-aos="fade-up" className="text-center shadow-hover p-3">
              <FaTooth size={50} className="mb-3" />
              <Card.Title>Stomatologija</Card.Title>
              <Card.Text>Kontrola i lečenje zuba i desni.</Card.Text>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ZAŠTO ODABRATI NAS */}
      <Container className="text-center mt-5">
        <h2>Zašto odabrati nas?</h2>
        <Row className="mt-4">
          <Col md={4}>
            <Card data-aos="fade-up" className="p-3 shadow-hover">
              <Card.Title>Profesionalno osoblje</Card.Title>
              <Card.Text>Iskusni lekari i medicinski tim.</Card.Text>
            </Card>
          </Col>
          <Col md={4}>
            <Card data-aos="fade-up" className="p-3 shadow-hover">
              <Card.Title>Moderna oprema</Card.Title>
              <Card.Text>Koristimo najsavremenije tehnologije.</Card.Text>
            </Card>
          </Col>
          <Col md={4}>
            <Card data-aos="fade-up" className="p-3 shadow-hover">
              <Card.Title>Brza zakazivanja</Card.Title>
              <Card.Text>Online kalendar i jednostavno zakazivanje.</Card.Text>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* KONTAKT */}
      <Container data-aos="fade-up" className="text-center mt-5 mb-5">
        <h2>Kontakt</h2>
        <p>Adresa: Bulevar Klinike 123, Beograd</p>
        <p>Email: info@SinergijaZdravlja.rs | Telefon: +381 11 1234567</p>
      </Container>

      <Footer />
    </>
  );
};

export default HomePage;
