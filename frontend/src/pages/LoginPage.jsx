// src/pages/LoginPage.jsx
import React from 'react';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container } from 'react-bootstrap';

const LoginPage = () => {
  return (
    <>
      <Container className="text-center mt-5">
        <h2>Login Page</h2>
        <p>Ovde ide forma za prijavu</p>
      </Container>
      <Footer />
    </>
  );
};

export default LoginPage;
