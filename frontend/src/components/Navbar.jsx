import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import api from "../api/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  // Resetuj state kad se navigacija promeni
  useEffect(() => {
    setLoggingOut(false);
    setUser(JSON.parse(localStorage.getItem("user")));
  }, [location]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/logout");
    } catch (err) {
      console.log("Logout error:", err);
    }
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setLoggingOut(false); // reset odmah
    navigate("/login");
  };

  const goHome = () => {
    if (user) {
      if (user.role === "patient") navigate("/patient/dashboard");
      else navigate("/dashboard");
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
              <button
                onClick={handleLogout}
                className="logout-btn d-flex align-items-center justify-content-center"
                disabled={loggingOut}
              >
                {loggingOut && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                {loggingOut ? "Odjavljivanje..." : "Logout"}
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
