type Props = {
  legendOpen: boolean;

  showCluster: boolean;

  showFasilitas: boolean;

  onClose: () => void;
};

export default function LegendPanel({
  legendOpen,

  showCluster,

  showFasilitas,

  onClose,
}: Props) {

  const clusterLegend = [
    {
      label: "Magnet Tinggi",
      color: "#1a9850",
    },

    {
      label: "Magnet Sedang",
      color: "#d4a900",
    },

    {
      label: "Magnet Rendah",
      color: "#d73027",
    },
  ];

  const fasilitasLegend = [
    {
      label: "Kuliner",
      color: "#01befe",
    },

    {
      label: "Supermarket",
      color: "#ffdd00",
    },

    {
      label: "Mall",
      color: "#ff7d00",
    },

    {
      label: "Pasar",
      color: "#ff006d",
    },

    {
      label: "Transportasi",
      color: "#adff02",
    },

    {
      label: "Lainnya",
      color: "#8f00ff",
    },
  ];

  return (
    <div
      className={`legend-panel ${
        legendOpen
          ? "legend-open"
          : ""
      }`}
    >

    <button
      className="legend-close-btn"
      onClick={onClose}
    >
      Tutup
    </button>

      {/* =========================
          CLUSTER LEGEND
      ========================= */}

      {showCluster && (

        <div className="legend-section">

          <h4>
            Cluster Aktivitas
          </h4>

          {clusterLegend.map(
            (item) => (

              <div
                key={item.label}
                className="legend-item"
              >

                <div
                  className="legend-color"
                  style={{
                    background:
                      item.color,
                  }}
                />

                <span>
                  {item.label}
                </span>

              </div>

            )
          )}

        </div>

      )}

      {/* =========================
          FASILITAS LEGEND
      ========================= */}

      {showFasilitas && (

        <div className="legend-section">

          <h4>
            Kategori Fasilitas
          </h4>

          {fasilitasLegend.map(
            (item) => (

              <div
                key={item.label}
                className="legend-item"
              >

                <div
                  className="legend-color"
                  style={{
                    background:
                      item.color,
                  }}
                />

                <span>
                  {item.label}
                </span>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}