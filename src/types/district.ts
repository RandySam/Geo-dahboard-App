export type DistrictDetail = {
  id: string;
  name: string;
  coordinates: [number, number];
  cluster: string;
  totalFacilities: number;
  dominantCategory: string;
  topActivities: string;
};