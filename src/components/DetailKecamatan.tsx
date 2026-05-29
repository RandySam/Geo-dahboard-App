import {
  ChevronDown,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type DistrictDetail = {
  id: string;

  name: string;

  coordinates: [
    number,
    number
  ];

  cluster: string;

  totalFacilities: number;

  dominantCategory: string;

  topActivities: string;
};

type Props = {
  data: DistrictDetail[];

  setSelectedCoords: React.Dispatch<
    React.SetStateAction<
      [number, number] | null
    >
  >;
};

export default function DetailKecamatan({
  data,

  setSelectedCoords,
}: Props) {
  /* =========================
     DEFAULT DISTRICT
  ========================= */

  const defaultDistrict =
    useMemo(() => {
      return data[0] || null;
    }, [data]);

  /* =========================
     STATE
  ========================= */

  const [
    selectedDistrictId,
    setSelectedDistrictId,
  ] = useState<
    string | null
  >(
    defaultDistrict
      ?.id || null
  );

  const [
    showDropdown,
    setShowDropdown,
  ] = useState(false);

  /* =========================
     ACTIVE DISTRICT
  ========================= */

  const activeDistrict =
    data.find(
      (district) =>
        district.id ===
        selectedDistrictId
    ) || null;

  /* =========================
     SET DEFAULT COORDS
  ========================= */

  useEffect(() => {
    if (
      activeDistrict
    ) {
      setSelectedCoords(
        activeDistrict.coordinates
      );
    }
  }, [
    activeDistrict,
    setSelectedCoords,
  ]);

  /* =========================
     HANDLE SELECT
  ========================= */

  const handleSelectDistrict =
    (
      district: DistrictDetail
    ) => {
      setSelectedDistrictId(
        district.id
      );

      setSelectedCoords(
        district.coordinates
      );

      setShowDropdown(
        false
      );
    };

  return (
    <div className="detail-kecamatan">
      {/* =========================
          HEADER
      ========================= */}

      <div className="detail-header">
        <div>
          <h3>
            Detail Kecamatan
          </h3>

          <span>
            Pilih kecamatan
            untuk melihat
            ringkasan aktivitas
          </span>
        </div>
      </div>

      {/* =========================
          DROPDOWN SELECTOR
      ========================= */}

      <div className="district-selector">
        <button
          className="district-selector-btn"
          onClick={() =>
            setShowDropdown(
              !showDropdown
            )
          }
        >
          <span>
            {activeDistrict
              ?.name ||
              "Pilih Kecamatan"}
          </span>

          <ChevronDown
            size={20}
          />
        </button>

        {showDropdown && (
          <div className="district-dropdown-menu">
            {data.map(
              (
                district
              ) => (
                <button
                  key={
                    district.id
                  }
                  className={`district-dropdown-item ${
                    selectedDistrictId ===
                    district.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelectDistrict(
                      district
                    )
                  }
                >
                  {
                    district.name
                  }
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* =========================
          ACTIVE CARD
      ========================= */}

      {activeDistrict ? (
        <div className="detail-card active">
          {/* =========================
              TITLE
          ========================= */}

          <div className="detail-card-header">
            <h4>
              {
                activeDistrict.name
              }
            </h4>
          </div>

          {/* =========================
              SUMMARY
          ========================= */}

          <div className="detail-summary">

            <div className="detail-summary-item">
              <span className="summary-label">
                Cluster
              </span>

              <strong
                className={`summary-value cluster ${
                  activeDistrict.cluster === "Magnet Rendah"
                    ? "cluster-rendah"
                    : activeDistrict.cluster === "Magnet Sedang"
                    ? "cluster-sedang"
                    : "cluster-tinggi"
                }`}
              >
                {activeDistrict.cluster}
              </strong>
            </div>

            <div className="detail-summary-item">
              <span className="summary-label">
                Total Fasilitas
              </span>

              <strong className="summary-value">
                {activeDistrict.totalFacilities}
              </strong>
            </div>

            <div className="detail-summary-item">
              <span className="summary-label">
                Kategori Dominan
              </span>

              <strong className="summary-value">
                {activeDistrict.dominantCategory}
              </strong>
            </div>

            <div className="detail-summary-item">
              <span className="summary-label">
                Aktivitas Tertinggi
              </span>

              <strong className="summary-value">
                {activeDistrict.topActivities}
              </strong>
          </div>
        </div>
        </div>
      ) : (
        <div className="detail-empty">
          Belum ada data
          kecamatan.
        </div>
      )}
    </div>
  );
}