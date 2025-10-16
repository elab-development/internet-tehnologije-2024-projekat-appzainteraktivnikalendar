// src/pages/RegisterPage.jsx
import React from 'react';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container } from 'react-bootstrap';

const RegisterPage = () => {
  return (
    <>
      <AppNavbar />
      <Container className="text-center mt-5">
        <h2>Register Page</h2>
        <p>Ovde ide forma za registraciju</p>
      </Container>
      <Footer />
    </>
  );
};

export default RegisterPage;
