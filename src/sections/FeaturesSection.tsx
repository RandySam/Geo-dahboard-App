import {
  FaMapMarkedAlt,
  FaFilter,
  FaChartBar,
  FaLayerGroup,
  FaSearchLocation,
  FaFileExport,
  FaDatabase,
  FaPalette,
  FaMobileAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaMapMarkedAlt />,
    title: "Visualisasi Cluster Aktivitas",
    desc:
      "Menampilkan sebaran dan klasifikasi cluster aktivitas berdasarkan tingkat Tinggi, Sedang, dan Rendah pada peta interaktif.",
  },

  {
    icon: <FaFilter />,
    title: "Filter & Overlay",
    desc:
      "Memfilter data fasilitas dan transportasi berdasarkan kategori tertentu serta menampilkan overlay di atas peta.",
  },

  {
    icon: <FaChartBar />,
    title: "Detail Statistik Wilayah",
    desc:
      "Mengakses statistik fasilitas dan transportasi pada setiap kecamatan secara detail melalui popup informasi.",
  },

  {
    icon: <FaLayerGroup />,
    title: "Interactive GIS Layers",
    desc:
      "Menampilkan berbagai layer seperti sistem administrasi, jaringan jalan, fasilitas umum, dan batas administrasi.",
  },

  // {
  //   icon: <FaSearchLocation />,
  //   title: "Analisis Spasial",
  //   desc:
  //     "Menyediakan analisis spasial untuk mengidentifikasi korelasi antar objek spasial secara mendalam.",
  // },

  {
    icon: <FaFileExport />,
    title: "Export & Reporting",
    desc:
      "Mengekspor hasil analisis dan peta ke format dokumentasi dan pelaporan.",
  },

  {
    icon: <FaDatabase />,
    title: "Data Terbuka & Terintegrasi",
    desc:
      "Menggunakan data terbuka dari instansi terkait yang terintegrasi untuk menjaga akurasi data.",
  },

    {
    icon: <FaPalette />,
    title: "Visualisasi Choropleth",
    desc:
        "Menampilkan visualisasi warna wilayah berdasarkan tingkat cluster aktivitas secara informatif dan interaktif.",
    },

  {
    icon: <FaMobileAlt />,
    title: "Responsif & User Friendly",
    desc:
      "Antarmuka responsif dan mudah digunakan di berbagai perangkat.",
  },
];

export default function FeaturesSection() {

  return (
    <section
    className="features-section"
    id="features"
>

      <div className="section-badge">
        Fitur Unggulan
      </div>

      <h2 className="section-title">
        Fitur Geodashboard
        <span>
          Cluster Aktivitas Kota Bekasi
        </span>
      </h2>

      <div className="features-grid">

        {features.map((item, index) => (

          <div
            key={index}
            className="feature-card"
          >

            <div className="feature-icon">
              {item.icon}
            </div>

            <div>

              <h3>
                {item.title}
              </h3>

              <p>
                {item.desc}
              </p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}