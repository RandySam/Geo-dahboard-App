import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Chart from "chart.js/auto";

export const exportAreaReport = (
  selectedAreas: any[]
) => {

  if (
    selectedAreas.length === 0
  ) {
    return;
  }

  const pdf = new jsPDF();

  /* =========================
      HEADER
  ========================= */

  pdf.setFontSize(20);

  pdf.text(
    "LAPORAN ANALISIS AREA TERPILIH",
    105,
    25,
    {
      align: "center",
    }
  );

  pdf.setFontSize(12);

  pdf.text(
    `Tanggal Export: ${new Date().toLocaleDateString(
      "id-ID"
    )}`,
    14,
    45
  );

  pdf.text(
    `Jumlah Area: ${selectedAreas.length}`,
    14,
    55
  );

  /* =========================
      TABEL RINGKASAN
  ========================= */

  autoTable(pdf, {
    startY: 70,

    head: [[
      "Area",
      "Total",
      "Dominan",
    ]],

    body: selectedAreas.map(
      (area) => [
        area.name,
        area.total,
        area.dominantCategory,
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
      labels:
        selectedAreas.map(
          area => area.name
        ),

      datasets: [
        {
          label:
            "Total Fasilitas",

          data:
            selectedAreas.map(
              area => area.total
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

  if (currentY > 170) {

    pdf.addPage();

    currentY = 20;

  }

  pdf.setFontSize(14);

  pdf.text(
    "Grafik Total Fasilitas per Area",
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
      DETAIL AREA
  ========================= */

  selectedAreas.forEach(
    (area) => {

      if (
        currentY > 240
      ) {

        pdf.addPage();

        currentY = 20;

      }

      pdf.setFontSize(14);

      pdf.text(
        area.name,
        14,
        currentY
      );

      currentY += 10;

      pdf.setFontSize(11);

      pdf.text(
        `Total Fasilitas: ${area.total}`,
        14,
        currentY
      );

      currentY += 8;

      pdf.text(
        `Kategori Dominan: ${area.dominantCategory}`,
        14,
        currentY
      );

      currentY += 10;

      pdf.text(
        "Distribusi Kategori:",
        14,
        currentY
      );

      currentY += 8;

      Object.entries(
        area.kategoriCount || {}
      ).forEach(
        ([kategori, jumlah]) => {

          pdf.text(
            `${kategori}: ${jumlah}`,
            20,
            currentY
          );

          currentY += 7;

        }
      );

      currentY += 8;

    }
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
    "Laporan-Area-Terpilih.pdf"
  );

};