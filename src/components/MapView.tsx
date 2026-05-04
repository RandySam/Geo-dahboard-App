import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  Pane,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import type { UserMarker } from "../types";
import GeomanControls from "./GeomanControls";
import MapMenu from "./MapMenu";

type Props = {
  userMarkers: UserMarker[];
  setUserMarkers: React.Dispatch<
    React.SetStateAction<UserMarker[]>
  >;
  selectedCoords: LatLngTuple | null;
};

const blueIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FitBounds({ data }: any) {
  const map = useMap();

  useEffect(() => {
    if (!data) return;

    const layer = L.geoJSON(data);
    map.fitBounds(layer.getBounds());
  }, [data, map]);

  return null;
}

function ZoomLabelController() {
  const map = useMap();

  useEffect(() => {
    const updateLabelSize = () => {
      const zoom = map.getZoom();

      document
        .querySelectorAll(".label-kecamatan")
        .forEach((el) => {
          const htmlEl = el as HTMLElement;

          htmlEl.style.fontSize = `${Math.max(
            10,
            zoom * 1.5
          )}px`;

          htmlEl.style.opacity = `${Math.min(
            1,
            zoom / 15
          )}`;
        });
    };

    map.on("zoomend", updateLabelSize);
    updateLabelSize();

    return () => {
      map.off("zoomend", updateLabelSize);
    };
  }, [map]);

  return null;
}

function ZoomLabelDynamic() {
  const map = useMap();

  useEffect(() => {
    const updateLabel = () => {
      const zoom = map.getZoom();

      map.eachLayer((layer: any) => {
        if (!layer.feature || !layer.getTooltip) return;

        const tooltip = layer.getTooltip();
        const el = tooltip?.getElement();

        if (!el) return;

        if (zoom >= 13) {
          const nama =
            layer.feature.properties?.Nama_Kecamatan ||
            layer.feature.properties?.NAMOBJ ||
            layer.feature.properties?.WADMKC ||
            "";

          layer.setTooltipContent(nama);

          el.style.display = "block";
          el.style.opacity = "1";
        } else {
          el.style.display = "none";
          el.style.opacity = "0";
        }
      });
    };

    map.on("zoomend", updateLabel);
    updateLabel();

    return () => {
      map.off("zoomend", updateLabel);
    };
  }, [map]);

  return null;
}

function FlyToLocation({
  coords,
}: {
  coords: LatLngTuple | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!coords) return;

    map.flyTo(coords, map.getZoom(), {
      duration: 1.5,
    });
  }, [coords, map]);

  return null;
}

function KotaLabel({ data }: any) {
  const map = useMap();

  useEffect(() => {
    if (!data) return;

    const layer = L.geoJSON(data);
    const center = layer.getBounds().getCenter();

    const label = L.tooltip({
      permanent: true,
      direction: "center",
      className: "label-kota",
    })
      .setLatLng(center)
      .setContent("Kota Bekasi")
      .addTo(map);

    const updateVisibility = () => {
      const zoom = map.getZoom();
      const el = label.getElement();

      if (!el) return;

      el.style.display =
        zoom >= 13 ? "none" : "block";
    };

    map.on("zoomend", updateVisibility);
    updateVisibility();

    return () => {
      map.off("zoomend", updateVisibility);
      map.removeLayer(label);
    };
  }, [data, map]);

  return null;
}

export default function MapView({
  userMarkers,
  setUserMarkers,
  selectedCoords,
}: Props) {
  const [fasilitasData, setFasilitasData] =
    useState<any>(null);

  const [batasData, setBatasData] =
    useState<any>(null);

  const [clusterData, setClusterData] =
    useState<any>(null);

  const [darkMode, setDarkMode] =
    useState(false);

  const [showBatas, setShowBatas] =
    useState(false);

  const [
    showFasilitas,
    setShowFasilitas,
  ] = useState(false);

  const [showCluster, setShowCluster] =
    useState(false);

  useEffect(() => {
    fetch("/data/Batas_Kota_Bekasi.geojson")
      .then((res) => res.json())
      .then((data) => {
        setBatasData(data);
      });

    fetch("/data/titik_fasilitas_bersih.geojson")
      .then((res) => res.json())
      .then((data) => {
        setFasilitasData(data);
      });

    fetch(
      "/data/cluster_kecamatan_wgs84.geojson"
    )
      .then((res) => res.json())
      .then((data) => {
        setClusterData(data);
      });
  }, []);

  return (
    <MapContainer
      center={[-6.24, 107]}
      zoom={11}
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      {/* =========================
          MENU
         ========================= */}
      <MapMenu
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showBatas={showBatas}
        setShowBatas={setShowBatas}
        showFasilitas={showFasilitas}
        setShowFasilitas={
          setShowFasilitas
        }
        showCluster={showCluster}
        setShowCluster={
          setShowCluster
        }
      />

      {/* =========================
          FIXED PANES
         ========================= */}
      <Pane
        name="clusterPane"
        style={{ zIndex: 200 }}
      />

      <Pane
        name="batasPane"
        style={{ zIndex: 400 }}
      />

      <Pane
        name="fasilitasPane"
        style={{ zIndex: 600 }}
      />

      {/* =========================
          BASEMAP
         ========================= */}
      {darkMode ? (
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; CartoDB"
        />
      ) : (
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; CartoDB"
        />
      )}

      {/* =========================
          CLUSTER
         ========================= */}
      {showCluster &&
        clusterData && (
          <GeoJSON
            pane="clusterPane"
            data={clusterData}
            style={(
              feature: any
            ) => ({
              fillColor:
                feature?.properties
                  ?.color ||
                "#cccccc",
              weight: 0,
              opacity: 0,
              color:
                "transparent",
              fillOpacity: 0.75,
            })}
            onEachFeature={(
              feature: any,
              layer: any
            ) => {
              layer.pm?.disable();
              layer.options.pmIgnore = true;

              const props =
                feature.properties ||
                {};

              const nama =
                props.Nama_Kecamatan ||
                props.WADMKC ||
                "Kecamatan";

              const cluster =
                props.Label_Cluster ||
                "Tidak diketahui";

              const skor =
                props.Skor_Aktivitas
                  ? Number(
                      props.Skor_Aktivitas
                    ).toFixed(2)
                  : "-";

              layer.bindPopup(`
                <b>${nama}</b><br/>
                Cluster: ${cluster}<br/>
                Skor Aktivitas: ${skor}
              `);

              layer.on({
                click: () => {
                  layer._map.fitBounds(
                    layer.getBounds()
                  );
                },

                mouseover: (
                  e: any
                ) => {
                  e.target.setStyle(
                    {
                      weight: 2,
                      color:
                        "#111",
                      opacity: 1,
                      fillOpacity: 0.9,
                    }
                  );
                },

                mouseout: (
                  e: any
                ) => {
                  e.target.setStyle(
                    {
                      weight: 0,
                      opacity: 0,
                      color:
                        "transparent",
                      fillOpacity: 0.75,
                    }
                  );
                },
              });
            }}
          />
        )}

      {/* =========================
          BATAS
         ========================= */}
      {showBatas &&
        batasData && (
          <GeoJSON
            pane="batasPane"
            data={batasData}
            interactive={false}
            style={{
              color: "green",
              weight: 2,
              fillOpacity: 0,
            }}
            onEachFeature={(
              feature: any,
              layer: any
            ) => {
              const nama =
                feature
                  .properties
                  ?.Nama_Kecamatan ||
                feature
                  .properties
                  ?.NAMOBJ ||
                feature
                  .properties
                  ?.WADMKC ||
                "Kecamatan";

              layer.bindTooltip(
                nama,
                {
                  permanent: true,
                  direction:
                    "center",
                  className:
                    "label-kecamatan",
                }
              );
            }}
          />
        )}

      {/* =========================
          FASILITAS
         ========================= */}
      {showFasilitas &&
        fasilitasData && (
          <GeoJSON
            pane="fasilitasPane"
            data={fasilitasData}
            bubblingMouseEvents={
              false
            }
            pointToLayer={(
              feature: any,
              latlng
            ) => {
              const kategori =
                feature
                  .properties
                  ?.kategori;

              return L.circleMarker(
                latlng,
                {
                  radius: 6,
                  fillColor:
                    kategori ===
                    "penting"
                      ? "red"
                      : "blue",
                  color:
                    "white",
                  weight: 1,
                  fillOpacity: 0.9,
                  interactive:
                    true,
                }
              );
            }}
            onEachFeature={(
              feature: any,
              layer: any
            ) => {
              layer.pm?.disable();
              layer.options.pmIgnore = true;

              const props =
                feature.properties ||
                {};

              layer.on({
                mouseover: (
                  e: any
                ) => {
                  e.target.setStyle?.(
                    {
                      radius: 8,
                    }
                  );
                },

                mouseout: (
                  e: any
                ) => {
                  e.target.setStyle?.(
                    {
                      radius: 6,
                    }
                  );
                },
              });

              const popupContent = `
                <b>${props.name || "-"}</b><br/>
                Jenis: ${
                  props.jenis_fasilitas ||
                  "-"
                }<br/>
                Amenity: ${
                  props.amenity ||
                  "-"
                }
              `;

              layer.on(
                "click",
                (e: any) => {
                  const map =
                    layer._map;

                  map.flyTo(
                    e.latlng,
                    map.getZoom() <
                      15
                      ? 15
                      : map.getZoom()
                  );

                  L.popup()
                    .setLatLng(
                      e.latlng
                    )
                    .setContent(
                      popupContent
                    )
                    .openOn(map);
                }
              );
            }}
          />
        )}

      {/* =========================
          HELPERS
         ========================= */}
      <ZoomLabelController />
      <ZoomLabelDynamic />
      <KotaLabel data={batasData} />
      <FlyToLocation
        coords={selectedCoords}
      />

      {batasData && (
        <FitBounds data={batasData} />
      )}

      {/* =========================
          GEOMAN
         ========================= */}
      <GeomanControls
        setUserMarkers={
          setUserMarkers
        }
      />

      {/* =========================
          USER MARKERS
         ========================= */}
      {userMarkers.map(
        (marker) => (
          <Marker
            key={
              marker.id +
              marker.name
            }
            position={
              marker.position
            }
            icon={blueIcon}
            zIndexOffset={
              1000
            }
          >
            <Popup>
              {marker.name}
            </Popup>
          </Marker>
        )
      )}
    </MapContainer>
  );
}