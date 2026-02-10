import { useState } from "react";
import type { LatLngTuple } from "leaflet";
import type { UserMarker } from "./types/marker";

import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";

export default function App() {
  const [userMarkers, setUserMarkers] = useState<UserMarker[]>([]);
  const [selectedCoords, setSelectedCoords] =
    useState<LatLngTuple | null>(null);

  return (
    <div className="app-container">
      <Sidebar
        userMarkers={userMarkers}
        onFlyTo={(coords) => setSelectedCoords(coords)}
        onDelete={(id) =>
          setUserMarkers((prev) => prev.filter((m) => m.id !== id))
        }
        onEdit={(id, newName) =>
          setUserMarkers((prev) =>
            prev.map((m) =>
              m.id === id ? { ...m, popUp: newName } : m
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
