import type { LatLngTuple } from "leaflet";

export type UserMarker = {
  id: string;
  geocode: LatLngTuple;
  popUp: string;
};
