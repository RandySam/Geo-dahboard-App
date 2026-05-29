import {
  useEffect,
} from "react";

import {
  useMap,
} from "react-leaflet";

export default function DisableContextMenu() {
  const map = useMap();

  useEffect(() => {
    const container =
      map.getContainer();

    const disableContextMenu =
      (
        e: MouseEvent
      ) => {
        e.preventDefault();
      };

    container.addEventListener(
      "contextmenu",
      disableContextMenu
    );

    /* =====================
       CLEANUP
       ===================== */
    return () => {
      container.removeEventListener(
        "contextmenu",
        disableContextMenu
      );
    };
  }, [map]);

  return null;
}