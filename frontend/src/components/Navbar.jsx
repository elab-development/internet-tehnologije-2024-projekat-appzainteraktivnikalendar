// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/Navbar.css';
import api from "../api/api";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await api.post("/logout"); // logout preko backend-a
    } catch (err) {
      console.log("Logout error:", err);
    }
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-logo">
        <img src="logo.png" alt="Sinergija Zdravlja" className="navbar-icon" />
        <span>Sinergija Zdravlja</span>
      </div>

      <ul className="navbar-links">
        {!user && (
          <>
            <li><Link to="/">Početna</Link></li>
            <li><Link to="/login">Prijava</Link></li>
            <li><Link to="/register">Registracija</Link></li>
          </>
        )}

        {user && (
          <>
            <li><span>{user.first_name}</span></li>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                  color: "#333",
                }}
              >
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
