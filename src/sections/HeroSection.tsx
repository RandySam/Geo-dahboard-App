import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DatasetModal from "../components/DatasetModal";

import kulinerImg from "../assets/kuliner.jpeg";
import mallImg from "../assets/mall.jpeg";
import pasarImg from "../assets/pasar.jpg";
import supermarketImg from "../assets/supermarket.jpg";
import transportasiImg from "../assets/transportasi.jpg";

export default function HeroSection() {

  const navigate =
    useNavigate();

  const [
    showDataset,
    setShowDataset,
  ] = useState(false);

  return (
    <>
      <section
        id="hero"
        className="hero"
      >

        {/* =========================
            LEFT
        ========================= */}

        <div className="hero-left">

          <div className="hero-badge">
            Web GIS Kota Bekasi
          </div>

          <h1 className="hero-title">

            Visualisasi
            Cluster Aktivitas
            Ekonomi
            <span>
              Kota Bekasi
            </span>

          </h1>

          <p className="hero-description">

            Platform geodashboard
            berbasis Web GIS untuk
            menganalisis dan
            memvisualisasikan
            pusat aktivitas ekonomi
            Kota Bekasi secara
            interaktif dan modern.

          </p>

          {/* =========================
              BUTTONS
          ========================= */}

          <div className="hero-buttons">

            <button
              className="hero-button primary"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Jelajahi Dashboard
            </button>

            <button
              className="hero-button secondary"
              onClick={() =>
                setShowDataset(true)
              }
            >
              Sumber Data
            </button>

          </div>

        </div>

        {/* =========================
            RIGHT
        ========================= */}

        <div className="hero-right">

          {/* MAIN IMAGE */}

          <div className="hero-image-large">

            <img
              src={transportasiImg}
              alt="Transportasi"
            />

          </div>

          {/* GRID IMAGE */}

          <div className="hero-image-grid">

            <div className="hero-image-card">

              <img
                src={mallImg}
                alt="Mall"
              />

              <span>
                Mall
              </span>

            </div>

            <div className="hero-image-card">

              <img
                src={supermarketImg}
                alt="Supermarket"
              />

              <span>
                Supermarket
              </span>

            </div>

            <div className="hero-image-card">

              <img
                src={pasarImg}
                alt="Pasar"
              />

              <span>
                Pasar
              </span>

            </div>

            <div className="hero-image-card">

              <img
                src={kulinerImg}
                alt="Kuliner"
              />

              <span>
                Kuliner
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          DATASET MODAL
      ========================= */}

      <DatasetModal
        open={showDataset}
        onClose={() =>
          setShowDataset(false)
        }
      />
    </>
  );
}