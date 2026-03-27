import React, { useEffect } from "react";
import Footer from "../components/Footer";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaStethoscope,
  FaHeartbeat,
  FaTooth,
  FaUserMd,
  FaLaptopMedical,
  FaCalendarAlt,
} from "react-icons/fa";
import "../styles/HomePage.css";
import AOS from "aos";
import "aos/dist/aos.css";

const services = [
  {
    icon: <FaStethoscope size={50} />,
    title: "Kardiologija",
    desc: "Pregledi srca i krvnih sudova.",
  },
  {
    icon: <FaHeartbeat size={50} />,
    title: "Dermatologija",
    desc: "Lečenje kože i kozmetički tretmani.",
  },
  {
    icon: <FaTooth size={50} />,
    title: "Stomatologija",
    desc: "Kontrola i lečenje zuba i desni.",
  },
];

const features = [
  {
    icon: <FaUserMd size={30} />,
    title: "Profesionalno osoblje",
    desc: "Iskusni lekari i medicinski tim.",
  },
  {
    icon: <FaLaptopMedical size={30} />,
    title: "Moderna oprema",
    desc: "Koristimo najsavremenije tehnologije.",
  },
  {
    icon: <FaCalendarAlt size={30} />,
    title: "Brza zakazivanja",
    desc: "Online kalendar i jednostavno zakazivanje.",
  },
];

const HomePage = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <>
      {/* HERO */}
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
          <Col md={6} data-aos="fade-right">
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
          <Col md={6} data-aos="fade-left">
            <img
              src="clinic-onama.jpg"
              alt="Klinika"
              className="img-fluid rounded shadow"
            />
          </Col>
        </Row>
      </Container>

      {/* USLUGE */}
      <Container className="mt-5">
        <h2 className="text-center mb-4">Naše specijalizacije</h2>
        <Row className="g-4">
          {services.map((s, i) => (
            <Col md={4} key={i} data-aos="fade-up" data-aos-delay={i * 100}>
              <Card className="text-center p-4 shadow-hover card-hover">
                <div className="service-icon mb-3">{s.icon}</div>
                <Card.Title>{s.title}</Card.Title>
                <Card.Text>{s.desc}</Card.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* ZAŠTO NAS */}
      <Container className="text-center mt-5">
        <h2>Zašto odabrati nas?</h2>
        <Row className="mt-4 g-4">
          {features.map((f, i) => (
            <Col md={4} key={i} data-aos="fade-up" data-aos-delay={i * 100}>
              <Card className="p-3 shadow-hover card-hover">
                <div className="feature-icon mb-2">{f.icon}</div>
                <Card.Title>{f.title}</Card.Title>
                <Card.Text>{f.desc}</Card.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* KONTAKT */}
      <Container className="text-center mt-5 mb-5" data-aos="fade-up">
        <h2>Kontakt</h2>
        <p>Adresa: Bulevar Klinike 123, Beograd</p>
        <p>Email: info@SinergijaZdravlja.rs | Telefon: +381 11 1234567</p>
      </Container>

      <Footer />
    </>
  );
};

export default HomePage;
