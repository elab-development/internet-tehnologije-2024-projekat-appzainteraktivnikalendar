import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import api from "../api/api";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.log("Logout error:", err);
    }
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const goHome = () => {
    if (user) {
      // Ako je pacijent — vodi ga na njegov dashboard
      if (user.role === "patient") navigate("/patient/dashboard");
      else navigate("/dashboard"); // fallback
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="custom-navbar">
      <div
        className="navbar-logo"
        onClick={goHome}
        style={{ cursor: "pointer" }}
      >
        <img src="logo.png" alt="Sinergija Zdravlja" className="navbar-icon" />
        <span>Sinergija Zdravlja</span>
      </div>

      <ul className="navbar-links">
        {!user && (
          <>
            <li>
              <NavLink to="/" end>
                Početna
              </NavLink>
            </li>
            <li>
              <NavLink to="/login">Prijava</NavLink>
            </li>
            <li>
              <NavLink to="/register">Registracija</NavLink>
            </li>
          </>
        )}

        {user && user.role === "patient" && (
          <>
            <li>
              <NavLink to="/patient/dashboard">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/patient/calendar">Kalendar</NavLink>
            </li>
            <li>
              <NavLink to="/patient/history">Istorija</NavLink>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
