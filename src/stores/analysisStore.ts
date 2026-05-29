import { create } from "zustand";

import {
  analysisService,
} from "../services/analysisService";

type AnalysisStore = {
  clusterData: any;

  loading: boolean;

  error: string | null;

  loadChoropleth: () => Promise<void>;

  runAnalysis: (
    jumlah_k: number,
    keterangan: string
  ) => Promise<void>;
};

export const useAnalysisStore =
  create<AnalysisStore>(
    (set) => ({
      clusterData: null,

      loading: false,

      error: null,

      loadChoropleth:
        async () => {
          try {
            set({
              loading: true,

              error: null,
            });

            const data =
              await analysisService.getLatestChoropleth();

            set({
              clusterData:
                data,

              loading: false,
            });
          } catch (err) {
            set({
              loading: false,

              error:
                "Belum ada hasil analisis",
            });
          }
        },

      runAnalysis:
        async (
          jumlah_k,
          keterangan
        ) => {
          try {
            set({
              loading: true,

              error: null,
            });

            const data =
              await analysisService.runKMeans(
                jumlah_k,
                keterangan
              );

            set({
              clusterData:
                data,

              loading: false,
            });
          } catch (err) {
            set({
              loading: false,

              error:
                "Gagal menjalankan analisis",
            });
          }
        },
    })
  );