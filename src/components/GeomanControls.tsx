import { useEffect } from "react";

import {
  booleanPointInPolygon,
} from "@turf/turf";

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

  userMarkers: UserMarker[];

  fasilitasData: any;

  setSelectedAreas:
    React.Dispatch<
      React.SetStateAction<any[]>
    >;

  setPendingPosition:
    React.Dispatch<
      React.SetStateAction<
        [number, number] | null
      >
    >;

  setShowFacilityModal:
    React.Dispatch<
      React.SetStateAction<boolean>
    >;
};

export default function GeomanControls({
  setUserMarkers,
  userMarkers,
  fasilitasData,
  setSelectedAreas,
  setPendingPosition,
  setShowFacilityModal,
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

        drawPolyline: false,

        drawPolygon: true,

        drawRectangle: false,

        drawCircle: false,

        drawCircleMarker:
          false,

        cutPolygon: false,

        dragMode: false,

        rotateMode: false,

        editMode: false,

        removalMode: true,
      }
    );

    leafletMap.pm.setGlobalOptions(
      {
        finishOn:
          "contextmenu",

        snappable: false,
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
        } =
          e.layer.getLatLng();

        setPendingPosition([
          lat,
          lng,
        ]);

        setShowFacilityModal(
          true
        );

        map.removeLayer(
          e.layer
        );
      }

      if (
        e.shape ===
        "Polygon"
      ) {

        if (
          !fasilitasData?.features
        )
          return;

        const polygon =
          e.layer.toGeoJSON();

        const selected =
          fasilitasData.features.filter(
            (
              feature: any
            ) =>
              booleanPointInPolygon(
                feature,
                polygon
              )
          );

        const selectedUserMarkers =
          userMarkers.filter(
            (marker) => {

              const point = {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [
                    marker.position[1],
                    marker.position[0],
                  ],
                },
                properties: {},
              };

              return booleanPointInPolygon(
                point as any,
                polygon
              );
            }
          );

        const kategoriCount:
          Record<string, number> =
          {};

        selected.forEach(
          (item: any) => {

            const kategori =
              item.properties
                ?.kategori_final ||
              "Lainnya";

            kategoriCount[
              kategori
            ] =
              (
                kategoriCount[
                  kategori
                ] || 0
              ) + 1;
          }
        );

        selectedUserMarkers.forEach(
          (marker) => {

            const kategori =
              marker.category ||
              "Lainnya";

            kategoriCount[
              kategori
            ] =
              (
                kategoriCount[
                  kategori
                ] || 0
              ) + 1;

          }
        );

        const dominantCategory =
          Object.entries(
            kategoriCount
          ).sort(
            (a, b) =>
              b[1] - a[1]
          )[0]?.[0] ||
          "-";

        const layerId =
          L.Util.stamp(
            e.layer
          );

        setSelectedAreas(
          (prev) => [
            ...prev,
            {
              id:
                crypto.randomUUID(),

              name:
                `Area #${
                  prev.length + 1
                }`,

              layerId,

              total:
                selected.length + selectedUserMarkers.length,

              dominantCategory,

              kategoriCount,

              facilities:
                selected,

              polygon,
            },
          ]
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

      const layerId =
        L.Util.stamp(
          e.layer
        );

      setSelectedAreas(
        (prev) => {

          return prev.filter(
            (area) =>
              area.layerId !==
              layerId
          );
        }
      );

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
        (prev) => {

          const updated =
            prev.filter(
              (marker) => {

                const [
                  mLat,
                  mLng,
                ] =
                  marker.position;

                return !(
                  Math.abs(
                    mLat - lat
                  ) < 0.000001 &&

                  Math.abs(
                    mLng - lng
                  ) < 0.000001
                );

              }
            );

          localStorage.setItem(
            "userFacilities",
            JSON.stringify(
              updated
            )
          );

          return updated;
        }
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
  }, [map, setUserMarkers, userMarkers, fasilitasData, setSelectedAreas]);

  return null;
}