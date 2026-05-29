import {
  FaEnvelope,
} from "react-icons/fa";

export default function AboutSection() {

  const team = [
    {
      name: "Randy Cheasario Sam",
      nim: "2602148783",
      major: "Computer Science - Software Enggineering",
      university: "Bina Nusantara",
      email: "randy.sam@binus.ac.id",
      image:
        "https://media.discordapp.net/attachments/1429781428975046741/1508749202652397799/Randy.jpg?ex=6a16abb1&is=6a155a31&hm=f6399263fdeb9d798e7d465588735af0e1cf0da4a571fbfe47d50ec3f62f717f&=&format=webp&width=189&height=224",
    },

    {
      name: "Farrel Hakkam Amar",
      nim: "2602202734",
      major: "Computer Science - Software Enggineering",
      university: "Bina Nusantara",
      email: "farrel.amar@binus.ac.id",
      image:
        "https://media.discordapp.net/attachments/1429781428975046741/1508749202321309726/Farrel.jpg?ex=6a16abb1&is=6a155a31&hm=e3de10b70f34857ed2d008d4fe80b86b4f10e71381039704cec23f0c9b151c49&=&format=webp&width=187&height=224",
    },

    {
      name: "Wafi Dian Akbar",
      nim: "2602205811",
      major: "Computer Science - Software Enggineering",
      university: "Bina Nusantara",
      email: "wafi.akbar@binus.ac.id",
      image:
        "https://media.discordapp.net/attachments/1429781428975046741/1508749203134877757/Wafi.jpg?ex=6a16abb1&is=6a155a31&hm=72b194e9f841322a86bb1d1fb347b4af00ac18318f7e37394b0b6918e8519ea1&=&format=webp&width=189&height=224",
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