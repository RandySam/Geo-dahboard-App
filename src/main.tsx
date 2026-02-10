import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import L from "leaflet";
(window as any).L = L;

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
