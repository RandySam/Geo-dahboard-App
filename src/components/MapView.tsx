import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useRef, useEffect } from "react";
import type { LatLngTuple, Map as LeafletMap } from "leaflet";
import type { UserMarker } from "../types/marker";
import GeomanControls from "./GeomanControls";

type Props = {
  userMarkers: UserMarker[];
  setUserMarkers: React.Dispatch<
    React.SetStateAction<UserMarker[]>
  >;
  selectedCoords: LatLngTuple | null;
};

export default function MapView({
  userMarkers,
  setUserMarkers,
  selectedCoords,
}: Props) {
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (selectedCoords && mapRef.current) {
      mapRef.current.flyTo(selectedCoords, 15);
    }
  }, [selectedCoords]);

  return (
    <div className="map-container">
      <MapContainer
        center={[-6.235972, 106.993462]}
        zoom={13}
        ref={mapRef}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup chunkedLoading>
          {userMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.geocode}
              eventHandlers={{
                contextmenu: () =>
                  setUserMarkers((prev) =>
                    prev.filter((m) => m.id !== marker.id)
                  ),
              }}
            >
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        <GeomanControls setUserMarkers={setUserMarkers} />
      </MapContainer>
    </div>
  );
}
