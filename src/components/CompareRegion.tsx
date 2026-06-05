import {
  useState,
  useRef,
  useEffect,
} from "react";

type Region = {
  id: string;

  name: string;
};

type Props = {
  regions: Region[];

  onCompare: (
    regionA: string,
    regionB: string
  ) => void;
};

export default function CompareRegion({
  regions,

  onCompare,
}: Props) {

  const [
    selectedA,
    setSelectedA,
  ] = useState("");

  const [
    selectedB,
    setSelectedB,
  ] = useState("");

  const [openA, setOpenA] =
  useState(false);

const [openB, setOpenB] =
  useState(false);

const dropdownRef =
  useRef<HTMLDivElement>(null);

useEffect(() => {

  const handleClickOutside =
    (event: MouseEvent) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenA(false);
        setOpenB(false);
      }
    };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

}, []);

  const handleCompare =
    () => {

      if (
        !selectedA ||
        !selectedB
      )
        return;

      if (
        selectedA ===
        selectedB
      )
        return;

      onCompare(
        selectedA,
        selectedB
      );
    };

  return (
    <div className="compare-region-card">

      {/* =========================
          HEADER
      ========================= */}

      <div className="compare-region-header">

        <h3>
          Bandingkan Wilayah
        </h3>

        <p>
          Pilih dua kecamatan
          untuk dibandingkan.
        </p>

      </div>

      {/* =========================
          SELECT GROUP
      ========================= */}

      <div
        className="compare-select-group"
        ref={dropdownRef}
      >

        {/* SELECT A */}

        <div className="district-selector">

          <button
            className="district-selector-btn"
            onClick={() =>
              setOpenA(!openA)
            }
          >
            <span>
              {selectedA ||
                "Pilih Kecamatan"}
            </span>

            <span>⌄</span>
          </button>

          {openA && (

            <div className="district-dropdown-menu">

              {regions.map(
                (region) => (

                  <button
                    key={region.id}
                    className={`district-dropdown-item ${
                      selectedA ===
                      region.name
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedA(
                        region.name
                      );
                      setOpenA(
                        false
                      );
                    }}
                  >
                    {region.name}
                  </button>

                )
              )}

            </div>

          )}

        </div>

        <div className="compare-and">
          &
        </div>

        {/* SELECT B */}

        <div className="district-selector">

          <button
            className="district-selector-btn"
            onClick={() =>
              setOpenB(!openB)
            }
          >
            <span>
              {selectedB ||
                "Pilih Kecamatan"}
            </span>

            <span>⌄</span>
          </button>

          {openB && (

            <div className="district-dropdown-menu">

              {regions.map(
                (region) => (

                  <button
                    key={region.id}
                    className={`district-dropdown-item ${
                      selectedB ===
                      region.name
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedB(
                        region.name
                      );
                      setOpenB(
                        false
                      );
                    }}
                  >
                    {region.name}
                  </button>

                )
              )}

            </div>

          )}

        </div>

      </div>

      {/* =========================
          BUTTON
      ========================= */}

      <button
        className="compare-button"
        onClick={
          handleCompare
        }
        disabled={
          !selectedA ||
          !selectedB ||
          selectedA ===
            selectedB
        }
      >
        Bandingkan
      </button>

    </div>
  );
}