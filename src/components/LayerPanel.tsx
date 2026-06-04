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

  const categoryColors: Record<
    string,
    string
  > = {
    Kuliner: "#01befe",
    Supermarket: "#ffdd00",
    Mall: "#ff7d00",
    Pasar: "#ff006d",
    Transportasi: "#adff02",
    Lainnya: "#8f00ff",
  };

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

              <div
                className="layer-label"
                style={{
                  opacity:
                    showFasilitas
                      ? 1
                      : 0.45,
                }}
              >

                <span
                  className="layer-dot"
                  style={{
                    background:
                      categoryColors[
                        category
                      ],
                  }}
                />

                <span>
                  {category}
                </span>

              </div>

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