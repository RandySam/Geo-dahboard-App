import {
  useEffect,
  useRef,
} from "react";

import {
  GeoJSON,
  MapContainer,
  Marker,
  Pane,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import type {
  UserMarker,
} from "../types/marker";

import GeomanControls from "./GeomanControls";

type Props = {
  darkMode: boolean;

  showBatas: boolean;

  showFasilitas: boolean;

  showCluster: boolean;

  selectedCategories: string[];

  fasilitasData: any;

  batasData: any;

  choroplethData: any;

  userMarkers: UserMarker[];

  setUserMarkers: React.Dispatch<
    React.SetStateAction<
      UserMarker[]
    >
  >;

  selectedCoords:
    | [number, number]
    | null;
};

/* ════════════════════════════════════════
   CUSTOM ICON
════════════════════════════════════════ */

const blueIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],
});

/* ════════════════════════════════════════
   FLY TO CONTROLLER
════════════════════════════════════════ */

function FlyToController({
  coords,
}: {
  coords:
    | [number, number]
    | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!coords)
      return;

    map.flyTo(
      coords,
      14,
      {
        duration: 1,
      }
    );
  }, [coords, map]);

  return null;
}

/* ════════════════════════════════════════
   LABEL CONTROLLER
════════════════════════════════════════ */

function ZoomLabelController() {
  const map = useMap();

  useEffect(() => {
    const updateLabels =
      () => {
        const zoom =
          map.getZoom();

        const labels =
          document.querySelectorAll(
            ".kecamatan-label"
          );

        labels.forEach(
          (label) => {
            (
              label as HTMLElement
            ).style.display =
              zoom >= 12
                ? "block"
                : "none";
          }
        );
      };

    updateLabels();

    map.on(
      "zoomend",
      updateLabels
    );

    return () => {
      map.off(
        "zoomend",
        updateLabels
      );
    };
  }, [map]);

  return null;
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */

export default function MapView({
  darkMode,

  showBatas,

  showFasilitas,

  showCluster,

  selectedCategories,

  fasilitasData,

  batasData,

  choroplethData,

  userMarkers,

  setUserMarkers,

  selectedCoords,
}: Props) {
  const mapRef =
    useRef<L.Map | null>(
      null
    );

    console.log(
  "FASILITAS DATA:",
  fasilitasData
);

console.log(
  "CHOROPLETH:",
  choroplethData
);

  /* ════════════════════════════════════════
     FILTER FASILITAS
  ════════════════════════════════════════ */

  const filteredFasilitas =
    fasilitasData
      ? {
          ...fasilitasData,

          features:
            fasilitasData.features.filter(
              (
                feature: any
              ) => {
                const kategori =
                  feature
                    .properties
                    ?.kategori_final;

                return selectedCategories.includes(
                  kategori
                );
              }
            ),
        }
      : null;

  /* ════════════════════════════════════════
     CHOROPLETH STYLE
  ════════════════════════════════════════ */

  const choroplethStyle =
    (feature: any) => {
      return {
        fillColor:
          feature?.properties
            ?.warna ||
          "#cccccc",

        weight: 1.5,

        opacity: 1,

        color: "#ffffff",

        fillOpacity: 0.75,
      };
    };

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[
          -6.27,
          106.99,
        ]}
        zoom={12}
        zoomControl={false}
        className="map-container"
        ref={mapRef}
      >
        {/* ════════════════════════════════════════
            BASEMAP
        ════════════════════════════════════════ */}

        <TileLayer
          url={
            darkMode
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          }
          attribution="&copy; CartoDB"
        />

        {/* ════════════════════════════════════════
            PANES
        ════════════════════════════════════════ */}

        <Pane
          name="clusterPane"
          style={{
            zIndex: 200,
          }}
        />

        <Pane
          name="batasPane"
          style={{
            zIndex: 300,
          }}
        />

        <Pane
          name="fasilitasPane"
          style={{
            zIndex: 500,
          }}
        />

        {/* ════════════════════════════════════════
            CHOROPLETH
        ════════════════════════════════════════ */}

        {showCluster &&
          choroplethData && (
            <GeoJSON
              key={JSON.stringify(
                choroplethData
              )}
              pane="clusterPane"
              data={choroplethData}
              style={
                choroplethStyle
              }
              onEachFeature={(
                feature: any,
                layer: any
              ) => {
                layer.pm?.disable();

                layer.options.pmIgnore =
                  true;

                const props =
                  feature.properties;

                layer.bindPopup(`
                  <div style="
                    font-family: Inter, sans-serif;
                    min-width: 240px;
                    line-height: 1.6;
                  ">

                    <h3 style="
                      margin-bottom: 12px;
                      color: #355872;
                      font-size: 18px;
                      font-weight: 700;
                    ">
                      ${
                        props.nama_kecamatan ||
                        "-"
                      }
                    </h3>

                    <p>
                      <b>Cluster:</b>
                      ${
                        props.cluster_label_text ||
                        "-"
                      }
                    </p>

                    <hr style="
                      margin: 12px 0;
                      border: none;
                      border-top: 1px solid #ddd;
                    " />

                    <p>
                      <b>Mall:</b>
                      ${
                        props.jumlah_mall_real ||
                        0
                      }
                    </p>

                    <p>
                      <b>Supermarket:</b>
                      ${
                        props.jumlah_supermarket ||
                        0
                      }
                    </p>

                    <p>
                      <b>Pasar:</b>
                      ${
                        props.jumlah_pasar_real ||
                        0
                      }
                    </p>

                    <p>
                      <b>Kuliner:</b>
                      ${
                        props.jumlah_kuliner ||
                        0
                      }
                    </p>

                    <p>
                      <b>Transportasi:</b>
                      ${
                        props.jumlah_transportasi ||
                        0
                      }
                    </p>

                    <hr style="
                      margin: 12px 0;
                      border: none;
                      border-top: 1px solid #ddd;
                    " />

                    <p>
                      <b>Total Fasilitas:</b>
                      ${
                        props.jumlah_fasilitas ||
                        0
                      }
                    </p>

                  </div>
                `);

                layer.on({
                  click: (
                    e: any
                  ) => {
                    if (
                      !mapRef.current
                    )
                      return;

                    mapRef.current.fitBounds(
                      e.target.getBounds(),
                      {
                        padding: [
                          40,
                          40,
                        ],

                        maxZoom: 13,
                      }
                    );
                  },

                  mouseover:
                    (
                      e: any
                    ) => {
                      e.target.setStyle(
                        {
                          fillOpacity: 0.9,

                          weight: 2,

                          color:
                            "#355872",
                        }
                      );
                    },

                  mouseout:
                    (
                      e: any
                    ) => {
                      e.target.setStyle(
                        choroplethStyle(
                          e.target
                            .feature
                        )
                      );
                    },
                });
              }}
            />
          )}

        {/* ════════════════════════════════════════
            BATAS KECAMATAN
        ════════════════════════════════════════ */}

        {showBatas &&
          batasData && (
            <GeoJSON
              pane="batasPane"
              data={batasData}
              interactive={false}
              style={{
                color:
                  "#355872",

                weight: 2.5,

                opacity: 1,

                fillOpacity: 0,
              }}
            />
          )}

        {/* ════════════════════════════════════════
            LABEL KECAMATAN
        ════════════════════════════════════════ */}

        {choroplethData && (
          <GeoJSON
            pane="batasPane"
            data={choroplethData}
            interactive={false}
            style={{
              opacity: 0,
              fillOpacity: 0,
            }}
            onEachFeature={(
              feature: any,
              layer: any
            ) => {
              const props =
                feature.properties;

              layer.bindTooltip(
                props.nama_kecamatan ||
                  "-",
                {
                  permanent: true,

                  direction:
                    "center",

                  className:
                    "kecamatan-label",

                  opacity: 1,
                }
              );
            }}
          />
        )}

        {/* ════════════════════════════════════════
            FASILITAS
        ════════════════════════════════════════ */}

        {showFasilitas &&
          filteredFasilitas && (
            <GeoJSON
              key={selectedCategories.join(
                "-"
              )}
              pane="fasilitasPane"
              data={
                filteredFasilitas
              }
              pointToLayer={(
                feature: any,
                latlng
              ) => {
                const categoryColors: Record<
                    string,
                    string
                  > = {
                    Kuliner: "#01befe",

                    Supermarket: "#ffdd00",

                    Mall: "#ff7d00",

                    Pasar: "#ff006d",

                    Transportasi: "#adff02",

                    Lainnya: "#8f00ff",
                  };

                const defaultStyle =
                  {
                    radius: 7.5,

                    fillColor:
                    categoryColors[
                      feature.properties
                        ?.kategori_final
                    ] || "#355872",

                    color:
                      "#ffffff",

                    weight: 1.5,

                    fillOpacity: 1,
                  };

                const hoverStyle =
                  {
                    radius: 10,

                    color:
                      "#ffffff",

                    weight: 2.5,

                    fillOpacity: 1,
                  };

                const marker =
                  L.circleMarker(
                    latlng,
                    defaultStyle
                  );

                marker.on({
                  mouseover:
                    (
                      e: any
                    ) => {
                      e.target.setStyle(
                        hoverStyle
                      );

                      e.target.bringToFront();
                    },

                  mouseout:
                    (
                      e: any
                    ) => {
                      e.target.setStyle(
                        defaultStyle
                      );
                    },
                });

                return marker;
              }}
              onEachFeature={(
                feature: any,
                layer: any
              ) => {
                layer.pm?.disable();

                layer.options.pmIgnore =
                  true;

                const props =
                  feature.properties;

                layer.bindPopup(`
                  <div style="
                    font-family: Inter, sans-serif;
                    min-width: 200px;
                  ">

                    <h3 style="
                      margin-bottom: 8px;
                    ">
                      ${
                        props.name ||
                        "-"
                      }
                    </h3>

                    <p>
                      <b>Kategori:</b>
                      ${
                        props.kategori_final ||
                        "-"
                      }
                    </p>

                  </div>
                `);

                layer.on({
                  click: (
                    e: any
                  ) => {
                    if (
                      !mapRef.current
                    )
                      return;

                    mapRef.current.flyTo(
                      e.latlng,
                      16,
                      {
                        duration: 1,
                      }
                    );
                  },
                });
              }}
            />
          )}

        {/* ════════════════════════════════════════
            USER MARKERS
        ════════════════════════════════════════ */}

        {userMarkers.map(
          (marker) => (
            <Marker
              key={
                marker.id
              }
              position={
                marker.position
              }
              icon={blueIcon}
            >
              <Popup>
                {
                  marker.name
                }
              </Popup>
            </Marker>
          )
        )}

        {/* ════════════════════════════════════════
            GEOMAN
        ════════════════════════════════════════ */}

        <GeomanControls
          setUserMarkers={
            setUserMarkers
          }
        />

        {/* ════════════════════════════════════════
            FLY TO
        ════════════════════════════════════════ */}

        {selectedCoords && (
          <FlyToController
            key={`${selectedCoords[0]}-${selectedCoords[1]}`}
            coords={
              selectedCoords
            }
          />
        )}

        {/* ════════════════════════════════════════
            LABEL CONTROLLER
        ════════════════════════════════════════ */}
        
        <ZoomLabelController />
      </MapContainer>
    </div>
  );
} 