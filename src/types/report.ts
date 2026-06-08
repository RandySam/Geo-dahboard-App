import type {
  DistrictDetail,
} from "./district";

export type DistrictReport =
  Omit<
    DistrictDetail,
    "coordinates"
  >;