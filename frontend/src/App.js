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
import PatientDashboard from "./pages/dashboard/PatientDashboard.jsx";
import DoctorDashboard from "./pages/dashboard/DoctorDashboard.jsx";
import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx";
import PatientCalendar from "./pages/patient/PatientCalendar.jsx";
import PatientHistory from "./pages/patient/PatientHistory.jsx";


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
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/patient/calendar" element={<PatientCalendar />} />
        <Route path="/patient/history" element={<PatientHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
