import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
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

    // 🚫 Disable default browser right click
    const container = map.getContainer();
    const disableContextMenu = (e: MouseEvent) =>
      e.preventDefault();
    container.addEventListener("contextmenu", disableContextMenu);

    leafletMap.pm.addControls({
      position: "topright",
      drawPolyline: true,
      drawMarker: true,
      editMode: true,
      removalMode: true,
    });

    leafletMap.pm.setGlobalOptions({
    finishOn: "contextmenu", // right click untuk finish
    });


    const handleCreate = (e: any) => {
      if (e.shape === "Marker") {
        const { lat, lng } = e.layer.getLatLng();

        setUserMarkers((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            geocode: [lat, lng] as LatLngTuple,
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

    map.on("pm:create", handleCreate);

    return () => {
      map.off("pm:create", handleCreate);
      container.removeEventListener(
        "contextmenu",
        disableContextMenu
      );
      leafletMap.pm.removeControls();
    };
  }, [map, setUserMarkers]);

  return null;
}
