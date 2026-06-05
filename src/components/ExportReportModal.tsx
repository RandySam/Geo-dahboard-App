import { useState } from "react";

import { createPortal } from "react-dom";

import { exportDistrictReport } from "../utils/exportPdf";

type District = {
  id: number;

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
  open: boolean;
  onClose: () => void;
  districts: District[];
};

export default function ExportReportModal({
  open,
  onClose,
  districts,
}: Props) {

  const [
    selectedDistricts,
    setSelectedDistricts,
  ] = useState<number[]>([]);

  const handleSelectAll = () => {

    if (
      selectedDistricts.length ===
      districts.length
    ) {

      setSelectedDistricts([]);

    } else {

      setSelectedDistricts(
        districts.map(
          district => district.id
        )
      );

    }

  };

  const handleToggleDistrict = (
    districtId: number
  ) => {

    setSelectedDistricts(prev =>

      prev.includes(districtId)

        ? prev.filter(
            id => id !== districtId
          )

        : [
            ...prev,
            districtId,
          ]

    );

  };

  if (!open) return null;

  return createPortal(

    <div className="export-modal-overlay">

      <div className="export-modal">

        <div className="export-modal-header">

          <h3>
            Export Laporan PDF
          </h3>

          <button
            onClick={onClose}
            className="export-close-btn"
          >
            ✕
          </button>

        </div>

        <div className="export-select-all">

          <label>

            <input
              type="checkbox"
              checked={
                selectedDistricts.length ===
                districts.length
              }
              onChange={
                handleSelectAll
              }
            />

            <span>
              Pilih Semua (
              {districts.length}
              {" "}
              Kecamatan)
            </span>

          </label>

        </div>

        <div className="export-modal-body">

          {districts.map(
            (district) => (

              <label
                key={district.id}
                className="export-item"
              >

                <input
                  type="checkbox"
                  checked={
                    selectedDistricts.includes(
                      district.id
                    )
                  }
                  onChange={() =>
                    handleToggleDistrict(
                      district.id
                    )
                  }
                />

                <div>

                  <strong>
                    {district.name}
                  </strong>

                  <div className="export-item-info">

                    {district.cluster}
                    {" | "}
                    {district.totalFacilities}
                    {" fasilitas"}

                  </div>

                </div>

              </label>

            )
          )}

        </div>

        <div className="export-modal-footer">

          <div className="export-selected-count">

            <span>
              Dipilih:
            </span>

            <strong>
              {selectedDistricts.length}
            </strong>

          </div>

          <button
            onClick={onClose}
          >
            Batal
          </button>

          <button
            disabled={
              selectedDistricts.length === 0
            }
            onClick={() => {

              const selectedData =
                districts.filter(
                  district =>
                    selectedDistricts.includes(
                      district.id
                    )
                );

              exportDistrictReport(
                selectedData
              );

            }}
          >
            Export PDF
          </button>

        </div>

      </div>

    </div>,

    document.body

  );
}