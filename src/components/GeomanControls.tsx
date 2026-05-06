import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { type LatLngTuple } from "leaflet";
import type { UserMarker } from "../types/marker";

type Props = {
  setUserMarkers: React.Dispatch<
    React.SetStateAction<UserMarker[]>
  >;
};

export default function GeomanControls({ setUserMarkers }: Props) {
  const map = useMap();

  useEffect(() => {
    const leafletMap = map as any;
    if (!leafletMap.pm) return;

    const container = map.getContainer();
    const disableContextMenu = (e: MouseEvent) =>
      e.preventDefault();

    container.addEventListener(
      "contextmenu",
      disableContextMenu
    );

    leafletMap.pm.addControls({
      position: "topleft",
      drawPolyline: true,
      drawMarker: true,
      editMode: false,
      removalMode: true,
      rotateMode: false,
    });

    leafletMap.pm.setGlobalOptions({
      finishOn: "contextmenu",
    });

    const handleCreate = (e: any) => {
      if (e.shape === "Marker") {
        const { lat, lng } = e.layer.getLatLng();

        setUserMarkers((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            name: "Lokasi Baru",
            position: [lat, lng] as LatLngTuple,
            popUp: "Lokasi Baru",
          },
        ]);

        map.removeLayer(e.layer);
      }

      if (e.shape === "Line") {
        e.layer.setStyle({
          color: "#2979ff",
          weight: 4,
        });
      }
    };

    const handleRemove = (e: any) => {
      if (e.layer instanceof L.Marker) {
        const { lat, lng } = e.layer.getLatLng();

        setUserMarkers((prev) =>
          prev.filter((marker) => {
            const [mLat, mLng] = marker.position;

            // 🔥 toleransi float compare
            return !(
              Math.abs(mLat - lat) < 0.000001 &&
              Math.abs(mLng - lng) < 0.000001
            );
          })
        );
      }
    };

    map.on("pm:create", handleCreate);
    map.on("pm:remove", handleRemove);

    return () => {
      map.off("pm:create", handleCreate);
      map.off("pm:remove", handleRemove);

      container.removeEventListener(
        "contextmenu",
        disableContextMenu
      );

      leafletMap.pm.removeControls();
    };
  }, [map, setUserMarkers]);

  return null;
}