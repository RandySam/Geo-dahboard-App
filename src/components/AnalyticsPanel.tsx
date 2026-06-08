import { useState } from "react";

import CompareRegion from "./CompareRegion";

import DetailKecamatan from "./DetailKecamatan";

import ChartBar from "./ChartBar";

import ChartPie from "./ChartPie";

import ExportReportModal from "./ExportReportModal";

import CompareCard from "./CompareCard";

import type {
  BarChartData,
  PieChartData,
} from "../types/chart";

import type {
  DistrictDetail,
} from "../types/district";

import type {
  CompareRegionItem,
  ComparisonResult,
} from "../types/comparison";

type Props = {
  districtDetails: DistrictDetail[];

  compareRegions: CompareRegionItem[];

  comparisonResult: ComparisonResult | null;

  barChartData: BarChartData[];

  pieChartData: PieChartData[];

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

            <CompareCard
              district={
                comparisonResult.districtA
              }
            />

            <CompareCard
              district={
                comparisonResult.districtB
              }
            />

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