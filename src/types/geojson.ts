import type { FeatureCollection, Geometry } from "geojson";

export type GeoJsonProperties = {
  nama?: string;
  Nama?: string;
  alamat?: string;
  kategori?: string;
};

export type GeoJsonData = FeatureCollection<
  Geometry,
  GeoJsonProperties
>;