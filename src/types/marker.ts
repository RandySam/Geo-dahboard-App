import type { LatLngTuple } from "leaflet";

export type UserMarker = {
  id: string;

  name: string;

  category: string;

  position: LatLngTuple;

  popUp: string;
};
