import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

/* =========================
   LEAFLET
========================= */

import L from "leaflet";

(window as any).L = L;

/* =========================
   GEOMAN
========================= */

import "@geoman-io/leaflet-geoman-free";

import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

/* =========================
   LEAFLET CSS
========================= */

import "leaflet/dist/leaflet.css";

/* =========================
   RENDER
========================= */

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>

    <App />

  </React.StrictMode>
);