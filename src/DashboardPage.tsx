import {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./index.css";

import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import Header from "./components/Header";
import LegendPanel from "./components/LegendPanel";

import type {
  UserMarker,
} from "./types/marker";

import {
  fetchBatasData,
  fetchFasilitasData,
  fetchLatestChoropleth,
} from "./services/gisService";

export default function DashboardPage() {

  /* =========================
     DARK MODE
  ========================= */

  const [
    darkMode,
    setDarkMode,
  ] = useState(false);

  /* =========================
     MAP LAYER
  ========================= */

  const [
    showBatas,
    setShowBatas,
  ] = useState(true);

  const [
    showFasilitas,
    setShowFasilitas,
  ] = useState(true);

  const [
    showCluster,
    setShowCluster,
  ] = useState(true);

  /* =========================
     CATEGORY FILTER
  ========================= */

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState<string[]>([
    "Mall",
    "Supermarket",
    "Pasar",
    "Kuliner",
    "Transportasi",
    "Lainnya",
  ]);

  /* =========================
     MAP FOCUS
  ========================= */

  const [
    selectedCoords,
    setSelectedCoords,
  ] = useState<
    [number, number] | null
  >(null);

  /* =========================
     USER MARKERS
  ========================= */

  const [
    userMarkers,
    setUserMarkers,
  ] = useState<
    UserMarker[]
  >([]);

  /* =========================
     GIS DATA
  ========================= */

  const [
    fasilitasData,
    setFasilitasData,
  ] = useState<any>(
    null
  );

  const [
    batasData,
    setBatasData,
  ] = useState<any>(
    null
  );

  /* =========================
     CHOROPLETH DATA
  ========================= */

  const [
    choroplethData,
    setChoroplethData,
  ] = useState<any>(
    null
  );

  /* =========================
     COMPARISON RESULT
  ========================= */

  const [
    comparisonResult,
    setComparisonResult,
  ] = useState<any>(
    null
  );

  /* =========================
     LOADING
  ========================= */

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  /* =========================
     LOAD INITIAL DATA
  ========================= */

  useEffect(() => {

    const loadInitialData =
      async () => {

        try {

          setLoading(true);

          setError(null);

          const [
            fasilitas,
            batas,
          ] =
            await Promise.all([
              fetchFasilitasData(),
              fetchBatasData(),
            ]);

          setFasilitasData(
            fasilitas
          );

          setBatasData(
            batas
          );

          try {

            const latest =
              await fetchLatestChoropleth();

            setChoroplethData(
              latest
            );

          } catch {

            console.log(
              "Belum ada hasil analisis sebelumnya."
            );
          }

        } catch (err) {

          console.error(
            err
          );

          setError(
            "Gagal memuat data GIS."
          );

        } finally {

          setLoading(false);
        }
      };

    loadInitialData();

  }, []);

  /* =========================
     OVERVIEW DATA
  ========================= */

  const totalKecamatan =
    12;

  const categoriesStat =
    useMemo(() => {

      if (
        !fasilitasData?.features
      )
        return [];

      const counts: Record<
        string,
        number
      > = {};

      fasilitasData.features.forEach(
        (
          feature: any
        ) => {

          const kategori =
            feature.properties
              ?.kategori_final;

          if (!kategori)
            return;

          counts[kategori] =
            (
              counts[
                kategori
              ] || 0
            ) + 1;
        }
      );

      return Object.entries(
        counts
      ).map(
        ([
          name,
          total,
        ]) => ({
          id:
            name.toLowerCase(),

          name,

          total,
        })
      );

    }, [fasilitasData]);

  /* =========================
     DISTRICT DETAILS
  ========================= */

  const districtDetails =
    useMemo(() => {

      if (
        !choroplethData?.features
      )
        return [];

      return choroplethData.features.map(
        (
          feature: any,
          index: number
        ) => {

          const props =
            feature.properties;

          let coordinates: [
            number,
            number
          ] = [
            -6.27,
            106.99,
          ];

          try {

            const rawCoords =
              feature.geometry
                ?.coordinates?.[0]?.[0]?.[0];

            if (
              rawCoords
            ) {

              coordinates = [
                rawCoords[1],
                rawCoords[0],
              ];
            }

          } catch {

            console.log(
              "Coordinate parsing fallback."
            );
          }

          const categories =
            [
              {
                name:
                  "Mall",

                total:
                  props.jumlah_mall_real ||
                  0,
              },

              {
                name:
                  "Supermarket",

                total:
                  props.jumlah_supermarket ||
                  0,
              },

              {
                name:
                  "Pasar",

                total:
                  props.jumlah_pasar_real ||
                  0,
              },

              {
                name:
                  "Kuliner",

                total:
                  props.jumlah_kuliner ||
                  0,
              },

              {
                name:
                  "Transportasi",

                total:
                  props.jumlah_transportasi ||
                  0,
              },
            ];

          const sorted =
            [
              ...categories,
            ].sort(
              (
                a,
                b
              ) =>
                b.total -
                a.total
            );

          const dominantCategory =
            sorted[0]
              ?.name || "-";

          const topActivities =
            sorted
              .filter(
                (
                  c
                ) =>
                  c.total >
                  0
              )
              .slice(0, 2)
              .map(
                (
                  c
                ) =>
                  c.name
              )
              .join(
                " & "
              );

          return {
            id:
              props.kecamatan_id ||
              `district-${index}`,

            name:
              props.nama_kecamatan ||
              "Unknown",

            coordinates,

            cluster:
              props.cluster_label_text ||
              "-",

            totalFacilities:
              props.jumlah_fasilitas ||
              0,

            dominantCategory,

            topActivities:
              topActivities ||
              "-",
          };
        }
      );

    }, [choroplethData]);

  /* =========================
     CHART DATA
  ========================= */

  const barChartData =
    categoriesStat.map(
      (item) => ({
        name:
          item.name,

        total:
          item.total,
      })
    );

  const pieChartData =
    categoriesStat.map(
      (item) => ({
        name:
          item.name,

        value:
          item.total,
      })
    );

  /* =========================
     COMPARE REGION
  ========================= */

  const compareRegions =
    useMemo(() => {

      return districtDetails.map(
        (
          district: any
        ) => ({
          id:
            district.id,

          name:
            district.name,
        })
      );

    }, [districtDetails]);

  const handleCompareRegion =
    (
      regionA: string,
      regionB: string
    ) => {

      const districtA =
        districtDetails.find(
          (
            district: any
          ) =>
            district.name ===
            regionA
        );

      const districtB =
        districtDetails.find(
          (
            district: any
          ) =>
            district.name ===
            regionB
        );

      if (
        !districtA ||
        !districtB
      )
        return;

      let summary =
        "";

      if (
        districtA.totalFacilities >
        districtB.totalFacilities
      ) {

        summary += `${districtA.name} memiliki aktivitas ekonomi lebih tinggi dibandingkan ${districtB.name}.`;

      } else if (
        districtB.totalFacilities >
        districtA.totalFacilities
      ) {

        summary += `${districtB.name} memiliki aktivitas ekonomi lebih tinggi dibandingkan ${districtA.name}.`;
      }

      summary += ` ${districtA.name} didominasi kategori ${districtA.dominantCategory}, sedangkan ${districtB.name} didominasi kategori ${districtB.dominantCategory}.`;

      setComparisonResult({
        districtA,
        districtB,
        summary,
      });
    };

  return (
    <div className="app-layout">

      {/* =========================
          HEADER
      ========================= */}

      <Header
        darkMode={
          darkMode
        }
        setDarkMode={
          setDarkMode
        }
      />

      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar
        totalKecamatan={
          totalKecamatan
        }
        categoriesStat={
          categoriesStat
        }
        showBatas={
          showBatas
        }
        setShowBatas={
          setShowBatas
        }
        showFasilitas={
          showFasilitas
        }
        setShowFasilitas={
          setShowFasilitas
        }
        showCluster={
          showCluster
        }
        setShowCluster={
          setShowCluster
        }
        selectedCategories={
          selectedCategories
        }
        setSelectedCategories={
          setSelectedCategories
        }
        districtDetails={
          districtDetails
        }
        compareRegions={
          compareRegions
        }
        comparisonResult={
          comparisonResult
        }
        barChartData={
          barChartData
        }
        pieChartData={
          pieChartData
        }
        setSelectedCoords={
          setSelectedCoords
        }
        onCompareRegion={
          handleCompareRegion
        }
      />

      {/* =========================
          MAP
      ========================= */}

      <div className="map-wrapper">

        {loading ? (

          <div className="loading-overlay">
            Memuat data GIS...
          </div>

        ) : error ? (

          <div className="loading-overlay">
            {error}
          </div>

        ) : null}

        <MapView
          darkMode={
            darkMode
          }
          showBatas={
            showBatas
          }
          showFasilitas={
            showFasilitas
          }
          showCluster={
            showCluster
          }
          selectedCategories={
            selectedCategories
          }
          fasilitasData={
            fasilitasData
          }
          batasData={
            batasData
          }
          choroplethData={
            choroplethData
          }
          userMarkers={
            userMarkers
          }
          setUserMarkers={
            setUserMarkers
          }
          selectedCoords={
            selectedCoords
          }
        />

        {/* =========================
            LEGEND PANEL
        ========================= */}

        <LegendPanel
          showCluster={
            showCluster
          }
          showFasilitas={
            showFasilitas
          }
        />

      </div>

    </div>
  );
}