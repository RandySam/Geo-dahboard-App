import {
  FaMapMarkerAlt,
  FaInstagram,
  FaYoutube,
  FaGithub,
  FaGlobe,
} from "react-icons/fa";

export default function Footer() {

  return (
    <footer className="footer">

      <div className="footer-content">

        <div className="footer-brand">

          <div className="footer-logo">

            <FaMapMarkerAlt />

          </div>

          <div>

            <h2>
              MagnetAktivitas
              <br />
              Kota Bekasi
            </h2>

            <p>
              Geodashboard untuk
              Visualisasi dan
              Analisis Magnet
              Aktivitas Kota Bekasi
            </p>

            <div className="footer-socials">

              <FaGlobe />
              <FaInstagram />
              <FaYoutube />
              <FaGithub />

            </div>

          </div>

        </div>

        <div className="footer-about">

          <h3>
            MagnetAktivitas Kota Bekasi
          </h3>

          <p>
            Platform geodashboard
            interaktif berbasis
            Web GIS untuk
            mendukung analisis
            spasial dan
            pengambilan keputusan
            di Kota Bekasi.
          </p>

        </div>

        <div className="footer-contact">

          <h3>
            Kontak
          </h3>

          <div className="footer-contact-item">

            <FaGithub />

            <span>
              github.com/RandySam/Geo-dahboard-App
            </span>

          </div>

          <div className="footer-contact-item">

          </div>

        </div>

      </div>

      <div className="footer-bottom">

        © 2026 MagnetAktivitas Kota Bekasi.
        All rights reserved.

      </div>

    </footer>
  );
}