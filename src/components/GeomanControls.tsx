import { useEffect } from "react";

import {
  useMap,
} from "react-leaflet";

import L, {
  type LatLngTuple,
} from "leaflet";

import type {
  UserMarker,
} from "../types/marker";

type Props = {
  setUserMarkers: React.Dispatch<
    React.SetStateAction<UserMarker[]>
  >;
};

export default function GeomanControls({
  setUserMarkers,
}: Props) {
  const map = useMap();

  useEffect(() => {
    const leafletMap =
      map as any;

    if (!leafletMap.pm)
      return;

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
       GEOMAN TOOLBAR
       ===================== */
    leafletMap.pm.addControls(
      {
        position:
          "topleft",

        drawMarker: true,

        drawPolyline: true,

        drawPolygon: true,

        drawRectangle:
          true,

        drawCircle: true,

        drawCircleMarker:
          false,

        cutPolygon: true,

        dragMode: true,

        rotateMode: true,

        editMode: true,

        removalMode: true,
      }
    );

    leafletMap.pm.setGlobalOptions(
      {
        finishOn:
          "contextmenu",
      }
    );

    /* =====================
       CREATE EVENT
       ===================== */
    const handleCreate = (
      e: any
    ) => {
      /* ==========
         MARKER
         ========== */
      if (
        e.shape ===
        "Marker"
      ) {
        const {
          lat,
          lng,
        } = e.layer.getLatLng();

        setUserMarkers(
          (prev) => [
            ...prev,
            {
              id:
                crypto.randomUUID(),

              name:
                "Lokasi Baru",

              position:
                [
                  lat,
                  lng,
                ] as LatLngTuple,

              popUp:
                "Lokasi Baru",
            },
          ]
        );

        map.removeLayer(
          e.layer
        );
      }

      /* ==========
         POLYLINE
         ========== */
      if (
        e.shape ===
        "Line"
      ) {
        e.layer.setStyle({
          color:
            "#355674",

          weight: 4,
        });
      }
    };

    /* =====================
       REMOVE EVENT
       ===================== */
    const handleRemove = (
      e: any
    ) => {
      if (
        e.layer instanceof
        L.Marker
      ) {
        const {
          lat,
          lng,
        } =
          e.layer.getLatLng();

        setUserMarkers(
          (prev) =>
            prev.filter(
              (
                marker
              ) => {
                const [
                  mLat,
                  mLng,
                ] =
                  marker.position;

                return !(
                  Math.abs(
                    mLat -
                      lat
                  ) <
                    0.000001 &&
                  Math.abs(
                    mLng -
                      lng
                  ) <
                    0.000001
                );
              }
            )
        );
      }
    };

    /* =====================
       REGISTER EVENTS
       ===================== */
    map.on(
      "pm:create",
      handleCreate
    );

    map.on(
      "pm:remove",
      handleRemove
    );

    /* =====================
       CLEANUP
       ===================== */
    return () => {
      map.off(
        "pm:create",
        handleCreate
      );

      map.off(
        "pm:remove",
        handleRemove
      );

      container.removeEventListener(
        "contextmenu",
        disableContextMenu
      );

      leafletMap.pm.removeControls();
    };
  }, [map, setUserMarkers]);

  return null;
}