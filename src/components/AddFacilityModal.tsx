import { useState } from "react";
import { FACILITY_CATEGORIES } from "../constants/categories";

type Props = {
  open: boolean;

  onClose: () => void;

  onSave: (
    name: string,
    category: string
  ) => void;
};

export default function AddFacilityModal({
  open,
  onClose,
  onSave,
}: Props) {

  const [
    name,
    setName,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState(
    FACILITY_CATEGORIES[0]
  );

  if (!open) {
    return null;
  }

  return (
    <div className="facility-modal-overlay">

      <div className="facility-modal">

        <h3>
          Tambah Fasilitas
        </h3>

        <input
          type="text"
          placeholder="Nama fasilitas"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
        >

          {
            FACILITY_CATEGORIES.map(
              category => (
                <option
                  key={category}
                >
                  {category}
                </option>
              )
            )
          }

        </select>

        <div className="facility-modal-actions">

          <button
            onClick={onClose}
          >
            Batal
          </button>

          <button
            onClick={() => {

              if (
                !name.trim()
              ) {
                return;
              }

              onSave(
                name,
                category
              );

              setName("");

              setCategory(
                  FACILITY_CATEGORIES[0]
                );

              onClose();
            }}
          >
            Simpan
          </button>

        </div>

      </div>

    </div>
  );
}