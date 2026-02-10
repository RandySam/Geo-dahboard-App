import L from "leaflet";

export const createCustomClusterIcon = (cluster: any) => {
  return new L.DivIcon({
    html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
    className: "custom-cluster-marker",
    iconSize: [33, 33],
  });
};
