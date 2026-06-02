import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"]
  },
  server: {
    host: true, // Memastikan Vite mendengarkan semua IP dalam Docker
    port: 5173,
    allowedHosts: [
      'geobekasi.site', 
      'www.geobekasi.site'
    ] 
  }
});
