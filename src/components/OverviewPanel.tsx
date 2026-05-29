type Props = {
  totalKecamatan: number;

  categoriesStat: {
    id: string;

    name: string;

    total: number;
  }[];
};

export default function OverviewPanel({
  totalKecamatan,
  categoriesStat,
}: Props) {
  return (
    <div className="overview-modern">
      {/* =====================
          HEADER
         ===================== */}

      <div className="overview-header">
        <h2>
          Kota Bekasi
        </h2>

        <span>
          2022-2026
        </span>
      </div>

      {/* =====================
          TOTAL CARD
         ===================== */}

      <div className="overview-total-card">
        <div className="overview-total-number">
          {totalKecamatan}
        </div>

        <div className="overview-total-label">
          Kecamatan
        </div>
      </div>

      {/* =====================
          GRID STATISTIK
         ===================== */}

      <div className="overview-grid">
        {categoriesStat.map(
          (item) => (
            <div
              key={item.id}
              className="overview-grid-card"
            >
              <div className="overview-grid-total">
                {item.total}
              </div>

              <div className="overview-grid-label">
                {item.name}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}