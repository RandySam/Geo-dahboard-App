import { useState } from "react";
import type { LatLngTuple } from "leaflet";
import type { UserMarker } from "./types/marker";

import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";

export default function App() {
  const [userMarkers, setUserMarkers] = useState<UserMarker[]>([]);
  const [selectedCoords, setSelectedCoords] =
    useState<LatLngTuple | null>(null);

  // 🔥 MOBILE SIDEBAR STATE
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {/* ===== MOBILE MENU BUTTON ===== */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      <Sidebar
        userMarkers={userMarkers}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}

        onFlyTo={(coords) => {
          setSelectedCoords(coords);

          // 🔥 AUTO CLOSE DI MOBILE SETELAH PILIH
          setSidebarOpen(false);
        }}

        onDelete={(id) =>
          setUserMarkers((prev) =>
            prev.filter((m) => m.id !== id) // 🔥 FIX pakai id
          )
        }

        onEdit={(id, newName) =>
          setUserMarkers((prev) =>
            prev.map((m) =>
              m.id === id
                ? { ...m, name: newName }
                : m
            )
          )
        }
      />

      <MapView
        userMarkers={userMarkers}
        setUserMarkers={setUserMarkers}
        selectedCoords={selectedCoords}
      />
    </div>
  );
}