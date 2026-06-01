import { api } from "./api";

export const fetchDatasets =
  async () => {

    const response =
      await api.get(
        "/dataset/list"
      );

    return response.data;
  };