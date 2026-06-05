import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Chart from "chart.js/auto";

type District = {
  id: number;
  name: string;
  cluster: string;
  totalFacilities: number;
  dominantCategory: string;
  topActivities: string;
};

export const exportDistrictReport = (
  districts: District[]
) => {

  const pdf = new jsPDF();

  const chartData = districts.map(
    district => ({
      name: district.name,
      total: district.totalFacilities,
    })
  );

  /* =========================
      HEADER
  ========================= */

  pdf.setFontSize(20);

  pdf.text(
    "LAPORAN ANALISIS FASILITAS EKONOMI",
    105,
    25,
    {
      align: "center",
    }
  );

  pdf.setFontSize(16);

  pdf.text(
    "KOTA BEKASI",
    105,
    35,
    {
      align: "center",
    }
  );

  pdf.setFontSize(11);

  pdf.text(
    `Tanggal Export: ${new Date().toLocaleDateString(
      "id-ID"
    )}`,
    20,
    55
  );

  pdf.text(
    `Jumlah Kecamatan: ${districts.length}`,
    20,
    65
  );

  /* =========================
      TABEL RINGKASAN
  ========================= */

  autoTable(pdf, {
    startY: 80,

    head: [[
      "Kecamatan",
      "Cluster",
      "Total",
      "Dominan",
      "Aktivitas",
    ]],

    body: districts.map(
      district => [
        district.name,
        district.cluster,
        district.totalFacilities,
        district.dominantCategory,
        district.topActivities,
      ]
    ),
  });

  let currentY =
    (pdf as any)
      .lastAutoTable
      .finalY + 15;

  /* =========================
      GRAFIK
  ========================= */

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 1000;
  canvas.height = 400;

  new Chart(canvas, {
    type: "bar",

    data: {
      labels: chartData.map(
        item => item.name
      ),

      datasets: [
        {
          label:
            "Total Fasilitas",

          data: chartData.map(
            item => item.total
          ),
        },
      ],
    },

    options: {
      responsive: false,
      animation: false,

      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  const chartImage =
    canvas.toDataURL(
      "image/png"
    );

  if (currentY > 180) {

    pdf.addPage();

    currentY = 20;

  }

  pdf.setFontSize(14);

  pdf.text(
    "Grafik Total Fasilitas per Kecamatan",
    14,
    currentY
  );

  currentY += 5;

  pdf.addImage(
    chartImage,
    "PNG",
    15,
    currentY,
    180,
    70
  );

  currentY += 85;

  /* =========================
      STATISTIK
  ========================= */

  const totalFacilities =
    districts.reduce(
      (sum, district) =>
        sum +
        district.totalFacilities,
      0
    );

  const tinggi =
    districts.filter(
      district =>
        district.cluster ===
        "Magnet Tinggi"
    ).length;

  const sedang =
    districts.filter(
      district =>
        district.cluster ===
        "Magnet Sedang"
    ).length;

  const rendah =
    districts.filter(
      district =>
        district.cluster ===
        "Magnet Rendah"
    ).length;

  pdf.setFontSize(14);

  pdf.text(
    "Statistik Ringkasan",
    14,
    currentY
  );

  currentY += 10;

  pdf.setFontSize(11);

  pdf.text(
    `Total Fasilitas: ${totalFacilities}`,
    14,
    currentY
  );

  currentY += 8;

  pdf.text(
    `Cluster Tinggi: ${tinggi}`,
    14,
    currentY
  );

  currentY += 8;

  pdf.text(
    `Cluster Sedang: ${sedang}`,
    14,
    currentY
  );

  currentY += 8;

  pdf.text(
    `Cluster Rendah: ${rendah}`,
    14,
    currentY
  );

  /* =========================
      KESIMPULAN
  ========================= */

  const maxFacilities =
    Math.max(
      ...districts.map(
        district =>
          district.totalFacilities
      )
    );

  const topDistrict =
    districts.find(
      district =>
        district.totalFacilities ===
        maxFacilities
    );

  currentY += 20;

  pdf.setFontSize(14);

  pdf.text(
    "Kesimpulan Analisis",
    14,
    currentY
  );

  currentY += 10;

  pdf.setFontSize(11);

  pdf.text(
    [
      `Analisis dilakukan terhadap ${districts.length} kecamatan yang dipilih.`,
      `Total fasilitas yang teridentifikasi sebanyak ${totalFacilities} fasilitas.`,
      `Kecamatan dengan jumlah fasilitas tertinggi adalah ${topDistrict?.name} dengan ${topDistrict?.totalFacilities} fasilitas.`,
      `Distribusi cluster terdiri dari ${tinggi} Magnet Tinggi, ${sedang} Magnet Sedang, dan ${rendah} Magnet Rendah.`,
    ],
    14,
    currentY
  );

  /* =========================
      FOOTER
  ========================= */

  const pageCount =
    pdf.getNumberOfPages();

  for (
    let i = 1;
    i <= pageCount;
    i++
  ) {

    pdf.setPage(i);

    pdf.setFontSize(8);

    pdf.text(
      `Dashboard Web GIS Analisis Fasilitas Ekonomi Kota Bekasi | Halaman ${i} dari ${pageCount}`,
      105,
      290,
      {
        align: "center",
      }
    );

  }

  pdf.save(
    "Laporan-Analisis-Kota-Bekasi.pdf"
  );

};