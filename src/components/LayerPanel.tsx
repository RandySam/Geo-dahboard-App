type Props = {
  showBatas: boolean;

  setShowBatas: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  showFasilitas: boolean;

  setShowFasilitas: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  showCluster: boolean;

  setShowCluster: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  selectedCategories: string[];

  setSelectedCategories: React.Dispatch<
    React.SetStateAction<
      string[]
    >
  >;

  categoriesStat: {
    id: string;

    name: string;

    total: number;
  }[];
};

export default function LayerPanel({
  showBatas,

  setShowBatas,

  showFasilitas,

  setShowFasilitas,

  showCluster,

  setShowCluster,

  selectedCategories,

  setSelectedCategories,
}: Props) {

  const categories = [
    "Mall",
    "Supermarket",
    "Pasar",
    "Kuliner",
    "Transportasi",
    "Lainnya",
  ];

  /* =========================
     TOGGLE CATEGORY
  ========================= */

  const toggleCategory =
    (
      category: string
    ) => {

      if (!showFasilitas)
        return;

      setSelectedCategories(
        (prev) =>
          prev.includes(
            category
          )
            ? prev.filter(
                (c) =>
                  c !==
                  category
              )
            : [
                ...prev,
                category,
              ]
      );
    };

  /* =========================
     TOGGLE FASILITAS
  ========================= */

  const handleToggleFasilitas =
    () => {

      setShowFasilitas(
        (prev) => {

          const next =
            !prev;

          /* =========================
             OFF → CLEAR CATEGORY
          ========================= */

          if (!next) {

            setSelectedCategories(
              []
            );

          }

          /* =========================
             ON → ENABLE ALL
          ========================= */

          else {

            setSelectedCategories([
              "Mall",
              "Supermarket",
              "Pasar",
              "Kuliner",
              "Transportasi",
              "Lainnya",
            ]);

          }

          return next;
        }
      );
    };

  return (
    <div className="layer-panel">

      {/* =====================
          LAYER SECTION
      ===================== */}

      <div className="layer-section">

        <h3>
          Layer Peta
        </h3>

        {/* =====================
            BATAS
        ===================== */}

        <div className="layer-item">

          <span>
            Batas Wilayah
          </span>

          <button
            className={`layer-switch ${
              showBatas
                ? "active"
                : ""
            }`}
            onClick={() =>
              setShowBatas(
                (
                  prev
                ) =>
                  !prev
              )
            }
          >
            <div className="layer-switch-thumb" />
          </button>

        </div>

        {/* =====================
            CLUSTER
        ===================== */}

        <div className="layer-item">

          <span>
            Cluster Aktivitas
          </span>

          <button
            className={`layer-switch ${
              showCluster
                ? "active"
                : ""
            }`}
            onClick={() =>
              setShowCluster(
                (
                  prev
                ) =>
                  !prev
              )
            }
          >
            <div className="layer-switch-thumb" />
          </button>

        </div>

        {/* =====================
            FASILITAS
        ===================== */}

        <div className="layer-item">

          <span>
            Titik Fasilitas
          </span>

          <button
            className={`layer-switch ${
              showFasilitas
                ? "active"
                : ""
            }`}
            onClick={
              handleToggleFasilitas
            }
          >
            <div className="layer-switch-thumb" />
          </button>

        </div>

      </div>

      {/* =====================
          CATEGORY SECTION
      ===================== */}

      <div className="layer-section">

        <h3>
          Kategori Fasilitas
        </h3>

        {categories.map(
          (
            category
          ) => (

            <div
              key={
                category
              }
              className="layer-item"
            >

              <span
                style={{
                  opacity:
                    showFasilitas
                      ? 1
                      : 0.45,
                }}
              >
                {category}
              </span>

              <button
                className={`layer-switch ${
                  selectedCategories.includes(
                    category
                  )
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggleCategory(
                    category
                  )
                }
                disabled={
                  !showFasilitas
                }
                style={{
                  opacity:
                    showFasilitas
                      ? 1
                      : 0.45,

                  cursor:
                    showFasilitas
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                <div className="layer-switch-thumb" />
              </button>

            </div>

          )
        )}

      </div>

    </div>
  );
}