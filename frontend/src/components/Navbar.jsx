import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="custom-navbar">
      <div className="navbar-logo">
        <img src="logo.png" alt="Sinergija Zdravlja" className="navbar-icon" />
        <span>Sinergija Zdravlja</span>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Početna</Link></li>
        <li><Link to="/login">Prijava</Link></li>
        <li><Link to="/register">Registracija</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
