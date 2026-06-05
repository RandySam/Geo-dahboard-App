import {
  exportAreaReport,
} from "../utils/exportAreaPdf";

type Props = {
  selectedAreas: any[];

  onRenameArea: (
    areaId: string,
    newName: string
  ) => void;

  onClose: () => void;
};

export default function SelectedAreasPanel({
  selectedAreas,
  onRenameArea,
  onClose,
}: Props) {

  if (
  selectedAreas.length === 0
) {
  return (

    <div className="selected-areas-panel">

      <div className="selected-areas-header">

        <h3>
          Area Terpilih
        </h3>

        <div className="selected-areas-actions">

          {selectedAreas.length > 0 && (
            <button
              className="export-area-btn"
              onClick={() =>
                exportAreaReport(
                  selectedAreas
                )
              }
            >
              <img
                  src="/icons/pdf.png"
                  alt="Export PDF"
                />
            </button>
          )}

          <button
            className="selected-areas-close"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

      </div>

      <div className="selected-areas-empty">

        <p>Gambar area di peta dengan polygon untuk melihat detailnya di sini.</p>

      </div>

    </div>

  );
}

  const handleEditArea = (
    area: any
  ) => {

    const newName =
      prompt(
        "Masukkan nama area",
        area.name ||
        `Area #${area.id}`
      );

    if (
      !newName ||
      !newName.trim()
    ) {
      return;
    }

    onRenameArea(
      area.id,
      newName.trim()
    );

  };

  return (
    <div
      className="
      selected-areas-panel
      "
    >

      <div
  className="
  selected-areas-header
  "
>

  <h3>
    Area Terpilih
  </h3>

  <div
    className="
    selected-areas-actions
    "
  >

    <button
      className="
      export-area-btn
      "
      onClick={() =>
        exportAreaReport(
          selectedAreas
        )
      }
    >
      <img
        src="/icons/pdf.png"
        alt="Export PDF"
      />
    </button>

    <button
      className="
      selected-areas-close
      "
      onClick={onClose}
    >
      ✕
    </button>

  </div>

</div>

      {selectedAreas.map(
        (
          area,
          index
        ) => (

          <div
            key={area.id}
            className="
            selected-area-card
            "
          >

            <div
              className="
              selected-area-title
              "
            >

              <h4>
                {
                  area.name ||
                  `Area #${index + 1}`
                }
              </h4>

              <button
                className="
                edit-area-btn
                "
                onClick={() =>
                  handleEditArea(
                    area
                  )
                }
              >

                <img
                  src="/icons/edit.png"
                  alt="Edit"
                />

              </button>

            </div>

            <p>
              Total:
              {" "}
              {area.total}
            </p>

            <p>
              Dominan:
              {" "}
              {
                area.dominantCategory
              }
            </p>

            <div className="area-category-list">

              {(
                Object.entries(
                  area.kategoriCount || {}
                ) as [string, number][]
              ).map(
                ([kategori, jumlah]) => (

                  <div
                    key={kategori}
                    className="area-category-item"
                  >

                    <span>
                      {kategori}
                    </span>

                    <strong>
                      {jumlah}
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>

        )
      )}

    </div>
  );
}