import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function DisableContextMenu() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    const disable = (e: MouseEvent) => {
      e.preventDefault();
    };

    container.addEventListener("contextmenu", disable);

    return () => {
      container.removeEventListener("contextmenu", disable);
    };
  }, [map]);

  return null;
}
