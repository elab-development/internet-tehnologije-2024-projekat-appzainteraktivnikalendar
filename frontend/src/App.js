// src/App.jsx
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import './components/Navbar.jsx';
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
