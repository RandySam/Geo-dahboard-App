import {
  FaEnvelope,
} from "react-icons/fa";

import fotoRandy from "../assets/Randy.jpg";
import fotoFarrel from "../assets/Farrel.jpg";
import fotoWafi from "../assets/Wafi.jpg";

export default function AboutSection() {

  const team = [
    {
      name: "Randy Cheasario Sam",
      nim: "2602148783",
      major: "Computer Science - Software Engineering",
      university: "Bina Nusantara",
      email: "randy.sam@binus.ac.id",
      image: fotoRandy,
    },

    {
      name: "Farrel Hakkam Amar",
      nim: "2602202734",
      major: "Computer Science - Software Engineering",
      university: "Bina Nusantara",
      email: "farrel.amar@binus.ac.id",
      image: fotoFarrel,
    },

    {
      name: "Wafi Dian Akbar",
      nim: "2602205811",
      major: "Computer Science - Software Engineering",
      university: "Bina Nusantara",
      email: "wafi.akbar@binus.ac.id",
      image: fotoWafi,
    },
  ];

  return (
    <section
    className="about-section"
    id="about"
>

      <div className="section-badge">
        Tentang Kami
      </div>

      <h2 className="section-title">
        Tim Pengembang
      </h2>

      <p className="about-desc">
        Kami adalah mahasiswa
        yang berkolaborasi untuk
        membangun platform
        geodashboard berbasis
        Web GIS yang informatif
        dan bermanfaat.
      </p>

      <div className="team-grid">

        {team.map((member, index) => (

          <div
            key={index}
            className="team-card"
          >

            <img
              src={member.image}
              alt={member.name}
              className="team-image"
            />

            <h3>
              {member.name}
            </h3>

            <div className="team-info">

              <p>
                <strong>NIM:</strong>
                {" "}
                {member.nim}
              </p>

              <p>
                <strong>Program Studi:</strong>
                {" "}
                {member.major}
              </p>

              <p>
                <strong>Universitas:</strong>
                {" "}
                {member.university}
              </p>

            </div>

            <div className="team-links">

              <a href="#">
                <FaEnvelope />
                {member.email}
              </a>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}
