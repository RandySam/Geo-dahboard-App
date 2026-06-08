export type CompareRegionItem = {
  id: string;
  name: string;
};

export type ComparisonDistrict = {
  name: string;
  cluster: string;
  totalFacilities: number;
  dominantCategory: string;
  topActivities: string;
};

export type ComparisonResult = {
  districtA: ComparisonDistrict;
  districtB: ComparisonDistrict;
  summary: string;
};