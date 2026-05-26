import {
  useState,
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

      <div className="compare-select-group">

        {/* =========================
            SELECT A
        ========================= */}

        <select
          className="compare-select"
          value={selectedA}
          onChange={(e) =>
            setSelectedA(
              e.target.value
            )
          }
        >

          <option
            value=""
            disabled
            hidden
          >
            Pilih Kecamatan
          </option>

          {regions.map(
            (region) => (

              <option
                key={region.id}
                value={region.name}
              >
                {region.name}
              </option>

            )
          )}

        </select>

        {/* =========================
            AND
        ========================= */}

        <div className="compare-and">
          &
        </div>

        {/* =========================
            SELECT B
        ========================= */}

        <select
          className="compare-select"
          value={selectedB}
          onChange={(e) =>
            setSelectedB(
              e.target.value
            )
          }
        >

          <option value="">
            Pilih Kecamatan
          </option>

          {regions.map(
            (region) => (

              <option
                key={region.id}
                value={region.name}
              >
                {region.name}
              </option>

            )
          )}

        </select>

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