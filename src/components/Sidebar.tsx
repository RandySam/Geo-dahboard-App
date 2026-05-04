import { useState } from "react";
import type { UserMarker } from "../types/marker";
import type { LatLngTuple } from "leaflet";

type Props = {
  userMarkers: UserMarker[];
  onFlyTo: (coords: LatLngTuple) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({
  userMarkers,
  onFlyTo,
  onDelete,
  onEdit,
  sidebarOpen,
  setSidebarOpen,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">
      <h2>Daftar Lokasi</h2>

      <button
        className="sidebar-close"
        onClick={() => setSidebarOpen(false)}
      >
        ✕
      </button>
    </div>

      {userMarkers.map((marker) => (
        <div key={marker.id} className="location-item">

          {editingId === marker.id ? (
            <>
              <input
                className="edit-input"
                value={editedName}
                autoFocus
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onEdit(marker.id, editedName);
                    setEditingId(null);
                  }
                }}
              />

              <div className="item-actions">
                <button
                  onClick={() => {
                    onEdit(marker.id, editedName);
                    setEditingId(null);
                  }}
                >
                  ✔
                </button>

                <button onClick={() => setEditingId(null)}>
                  ✖
                </button>
              </div>
            </>
          ) : (
            <>
              <span onClick={() => {onFlyTo(marker.position); setSidebarOpen(false);}}>
                {marker.name}
              </span>

              <div className="item-actions">
                <button
                  onClick={() => {
                    setEditingId(marker.id);
                    setEditedName(marker.name);
                  }}
                >
                  ✏
                </button>

                <button onClick={() => onDelete(marker.id)}>
                  🗑
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
