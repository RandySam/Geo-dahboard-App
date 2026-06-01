import { useNavigate } from "react-router-dom";

import {
  FaMapMarkedAlt,
} from "react-icons/fa";

export default function Navbar() {

  const navigate =
    useNavigate();

  return (
    <nav className="navbar">

      {/* =========================
          LOGO
      ========================= */}

      <div className="navbar-logo">

        <div className="navbar-logo-icon">
          <FaMapMarkedAlt />
        </div>

        <div className="navbar-logo-text">

          <h2>
            GeoBekasi
          </h2>

          <span>
            Kota Bekasi
          </span>

        </div>

      </div>

      {/* =========================
          MENU
      ========================= */}

      <div className="navbar-links">

        <a href="#hero">
          Beranda
        </a>

        <a href="#features">
          Fitur
        </a>

        <a href="#about">
          Tentang Kami
        </a>

      </div>

      {/* =========================
          BUTTON
      ========================= */}

      <button
        className="navbar-button"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        Buka Dashboard
      </button>

    </nav>
  );
}