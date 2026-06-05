import { useState } from "react";

import CompareRegion from "./CompareRegion";

import DetailKecamatan from "./DetailKecamatan";

import ChartBar from "./ChartBar";

import ChartPie from "./ChartPie";

import ExportReportModal from "./ExportReportModal";

type Props = {
  districtDetails: any[];

  compareRegions: any[];

  comparisonResult: any;

  barChartData: any[];

  pieChartData: any[];

  areaStats: any;

  setSelectedCoords: React.Dispatch<
    React.SetStateAction<
      [number, number] | null
    >
  >;

  onCompareRegion: (
    regionA: string,
    regionB: string
  ) => void;

  selectedDistrict: string;

  error?: string | null;
};

export default function AnalyticsPanel({
  districtDetails,

  compareRegions,

  comparisonResult,

  barChartData,

  pieChartData,

  areaStats,

  setSelectedCoords,

  onCompareRegion,

  selectedDistrict,

  error,
}: Props) {

  const [
    showExportModal,
    setShowExportModal
  ] = useState(false);

  return (
    <div className="analytics-panel">

      {/* =========================
          WARNING
      ========================= */}

      {error && (
        <div className="analytics-warning">
          {error}
        </div>
      )}

      {/* =========================
          DETAIL KECAMATAN
      ========================= */}

      <DetailKecamatan
        data={
          districtDetails
        }
        setSelectedCoords={
          setSelectedCoords
        }
        selectedDistrict={
          selectedDistrict
        }
      />

      {/* =========================
          BAR CHART
      ========================= */}

      <ChartBar
        data={barChartData}
      />

      {/* =========================
          PIE CHART
      ========================= */}

      <ChartPie
        data={pieChartData}
      />

      {/* =========================
          COMPARE REGION
      ========================= */}

      <CompareRegion
        regions={
          compareRegions
        }
        onCompare={
          onCompareRegion
        }
      />

      {/* =========================
          COMPARE RESULT
      ========================= */}

      {comparisonResult && (

        <div className="compare-result">

          {/* =========================
              CARD GRID
          ========================= */}

          <div className="compare-card-grid">

            {/* =========================
                DISTRICT A
            ========================= */}

            <div className="compare-card">

              <h4>
                {
                  comparisonResult
                    .districtA
                    .name
                }
              </h4>

              <div className="compare-card-content">

                <div className="compare-item">

                  <span>
                    Cluster
                  </span>

                  <strong
                    className={`${
                      comparisonResult
                        .districtA
                        .cluster ===
                      "Magnet Rendah"
                        ? "cluster-rendah"
                        : comparisonResult
                            .districtA
                            .cluster ===
                          "Magnet Sedang"
                        ? "cluster-sedang"
                        : "cluster-tinggi"
                    }`}
                  >
                    {
                      comparisonResult
                        .districtA
                        .cluster
                    }
                  </strong>

                </div>

                <div className="compare-item">

                  <span>
                    Total Fasilitas
                  </span>

                  <strong>
                    {
                      comparisonResult
                        .districtA
                        .totalFacilities
                    }
                  </strong>

                </div>

                <div className="compare-item">

                  <span>
                    Kategori Dominan
                  </span>

                  <strong>
                    {
                      comparisonResult
                        .districtA
                        .dominantCategory
                    }
                  </strong>

                </div>

                <div className="compare-item">

                  <span>
                    Aktivitas Tertinggi
                  </span>

                  <strong>
                    {
                      comparisonResult
                        .districtA
                        .topActivities
                    }
                  </strong>

                </div>

              </div>

            </div>

            {/* =========================
                DISTRICT B
            ========================= */}

            <div className="compare-card">

              <h4>
                {
                  comparisonResult
                    .districtB
                    .name
                }
              </h4>

              <div className="compare-card-content">

                <div className="compare-item">

                  <span>
                    Cluster
                  </span>

                  <strong
                    className={`${
                      comparisonResult
                        .districtB
                        .cluster ===
                      "Magnet Rendah"
                        ? "cluster-rendah"
                        : comparisonResult
                            .districtB
                            .cluster ===
                          "Magnet Sedang"
                        ? "cluster-sedang"
                        : "cluster-tinggi"
                    }`}
                  >
                    {
                      comparisonResult
                        .districtB
                        .cluster
                    }
                  </strong>

                </div>

                <div className="compare-item">

                  <span>
                    Total Fasilitas
                  </span>

                  <strong>
                    {
                      comparisonResult
                        .districtB
                        .totalFacilities
                    }
                  </strong>

                </div>

                <div className="compare-item">

                  <span>
                    Kategori Dominan
                  </span>

                  <strong>
                    {
                      comparisonResult
                        .districtB
                        .dominantCategory
                    }
                  </strong>

                </div>

                <div className="compare-item">

                  <span>
                    Aktivitas Tertinggi
                  </span>

                  <strong>
                    {
                      comparisonResult
                        .districtB
                        .topActivities
                    }
                  </strong>

                </div>

              </div>

            </div>

          </div>

          {/* =========================
              SUMMARY
          ========================= */}

          <div className="compare-summary">

            <h4>
              Kesimpulan Perbandingan
            </h4>

            <p>
              {
                comparisonResult
                  .summary
              }
            </p>

          </div>

        </div>

      )}
      <div className="export-report-section">

        <div className="export-report-content">

          <h3>
            Export Laporan
          </h3>

          <p>
            Export hasil analisis kecamatan
            ke dalam format PDF yang berisi
            ringkasan data, grafik, statistik,
            dan kesimpulan analisis.
          </p>

        </div>

        <button
          className="export-report-btn"
          onClick={() =>
            setShowExportModal(true)
          }
        >
          Export PDF
        </button>

      </div>
      <ExportReportModal
        open={showExportModal}
        onClose={() =>
          setShowExportModal(false)
        }
        districts={districtDetails}
      />
    </div>
  );
}