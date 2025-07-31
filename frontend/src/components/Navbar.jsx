// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic if needed
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-title">Inventory Management System</div>
      <button className="logout-button" onClick={handleLogout}>
        🔒 Logout
      </button>
    </header>
  );
};

export default Navbar;
