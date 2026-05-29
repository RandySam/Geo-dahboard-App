import { api } from "./api";

/* =========================
   RUN SPATIAL ANALYSIS
========================= */

export const runSpatialAnalysis =
  async () => {
    try {
      const response =
        await api.post(
          "/analisis/run",
          {
            jumlah_k: 3,

            keterangan:
              "Analisis K-Means Web GIS",
          }
        );

      if (
        !response.data
      ) {
        throw new Error(
          "Response analisis kosong."
        );
      }

      return response.data;
    } catch (
      error
    ) {
      console.error(
        "[RUN ANALYSIS ERROR]",
        error
      );

      throw error;
    }
  };

/* =========================
   FETCH LAST CHOROPLETH
========================= */

export const fetchLatestChoropleth =
  async () => {
    try {
      const response =
        await api.get(
          "/analisis/choropleth"
        );

      if (
        !response.data
      ) {
        throw new Error(
          "Belum ada hasil analisis."
        );
      }

      return response.data;
    } catch (
      error
    ) {
      console.error(
        "[FETCH CHOROPLETH ERROR]",
        error
      );

      throw error;
    }
  };

/* =========================
   FETCH FASILITAS DATA
========================= */

export const fetchFasilitasData =
  async () => {
    try {
      const response =
        await fetch(
          "/data/titik_fasilitas_bersih.geojson"
        );

      if (
        !response.ok
      ) {
        throw new Error(
          "Gagal memuat data fasilitas."
        );
      }

      return response.json();
    } catch (
      error
    ) {
      console.error(
        "[FETCH FASILITAS ERROR]",
        error
      );

      throw error;
    }
  };

/* =========================
   FETCH BATAS DATA
========================= */

export const fetchBatasData =
  async () => {
    try {
      const response =
        await fetch(
          "/data/Batas_Kota_Bekasi.geojson"
        );

      if (
        !response.ok
      ) {
        throw new Error(
          "Gagal memuat data batas kota."
        );
      }

      return response.json();
    } catch (
      error
    ) {
      console.error(
        "[FETCH BATAS ERROR]",
        error
      );

      throw error;
    }
  };

/* =========================
   BACKEND READY NOTES
========================= */

/*
  CURRENT ARCHITECTURE

  React Frontend
      ↓
  gisService.ts
      ↓
  api.ts (Axios Layer)
      ↓
  FastAPI Backend
      ↓
  K-Means Analysis
      ↓
  GeoJSON Response
      ↓
  Choropleth Render

  ==================================

  LOCAL DATA:
  - batas wilayah
  - fasilitas

  BACKEND DATA:
  - cluster choropleth
  - hasil analisis K-Means

  ==================================

  FRONTEND RESPONSIBILITY:
  - render map
  - filter layer
  - trigger analysis
  - display popup
  - UI interaction

  BACKEND RESPONSIBILITY:
  - spatial analysis
  - K-Means clustering
  - generate GeoJSON
  - scoring
  - metadata
  - persistence

  ==================================

  FUTURE IMPROVEMENT:

  Jika nanti semua GIS
  dipindahkan ke backend:

  fetch("/data/...")

  cukup diganti menjadi:

  api.get("/...")

  tanpa mengubah:
  - App.tsx
  - MapView.tsx
  - Sidebar.tsx

  karena architecture
  sekarang sudah memakai
  service abstraction layer.
*/