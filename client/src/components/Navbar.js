import React from 'react';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">SB Stocks</a></div>
      <div className="navbar-links">
        <a href="/register">Register</a>
        <a href="/login">Login</a> {/* Updated link to Register page */}
      </div>
    </nav>
  );
}

export default Navbar;