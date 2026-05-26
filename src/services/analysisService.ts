import axios from "axios";

const API_URL =
  "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,

  headers: {
    "Content-Type":
      "application/json",
  },
});

export const analysisService = {
  async runKMeans(
    jumlah_k: number,
    keterangan: string
  ) {
    const response =
      await api.post(
        "/analisis/run",
        {
          jumlah_k,
          keterangan,
        }
      );

    return response.data;
  },

  async getLatestChoropleth() {
    const response =
      await api.get(
        "/analisis/choropleth"
      );

    return response.data;
  },
};