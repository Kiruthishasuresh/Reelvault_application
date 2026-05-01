import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiLogOut, FiFilm } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className="nav-brand">🎬 ReelVault</div>
      </Link>

      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
          <FiHome /> Home
        </Link>

        <div className="nav-user">
          <div className="nav-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            {user?.username}
          </span>
          <button className="btn-logout" onClick={logout} title="Logout">
            <FiLogOut />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
