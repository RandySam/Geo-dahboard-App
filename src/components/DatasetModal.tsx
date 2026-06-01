import {
  useEffect,
  useState,
} from "react";

import {
  X,
  Database,
} from "lucide-react";

import {
  fetchDatasets,
} from "../services/datasetService";

import { BASE_URL }
from "../services/api";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Dataset = {
  id: string;
  name: string;
  filename: string;
  type: string;
  description: string;
  download_url: string;
};

export default function DatasetModal({
  open,
  onClose,
}: Props) {

const [
  datasets,
  setDatasets,
] = useState<
Dataset[]

> ([]);

const [
  loading,
  setLoading,
] = useState(false);

useEffect(() => {
  if (!open)
    return;

  const loadDatasets =
    async () => {

      try {

        setLoading(
          true
        );

        const response =
          await fetchDatasets();

        setDatasets(
          response.datasets ||
          []
        );

      } catch (
        error
      ) {

        console.error(
          "[DATASET ERROR]",
          error
        );

      } finally {

        setLoading(
          false
        );
      }
    };

  loadDatasets();

}, [open]);

if (!open)
return null;

return ( <div
   className="dataset-modal-overlay"
   onClick={onClose}
 >
<div
className="dataset-modal"
onClick={(e) =>
e.stopPropagation()
}
>
    {/* HEADER */}

    <div className="dataset-modal-header">

      <div className="dataset-title">

        <Database
          size={22}
        />

        <h2>
          Data dan
          Metodologi
          Penelitian
        </h2>

      </div>

      <button
        className="dataset-close"
        onClick={onClose}
      >
        <X
          size={20}
        />
      </button>

    </div>

    {/* CONTENT */}

    <div className="dataset-modal-content">

      {/* DATASET DARI BACKEND */}

      {loading ? (

        <div className="dataset-card full-width">

          <p>
            Memuat
            dataset...
          </p>

        </div>

      ) : (

        datasets.map(
          (
            dataset
          ) => (

            <div
              key={
                dataset.id
              }
              className="dataset-card"
            >

              <h3>
                {
                  dataset.name
                }
              </h3>

              <p>
                {
                  dataset.description
                }
              </p>

              <ul>

                <li>
                  Format:
                  {" "}
                  {
                    dataset.type
                  }
                </li>

                <li>
                  File:
                  {" "}
                  {
                    dataset.filename
                  }
                </li>

              </ul>

              <a
                href={`${BASE_URL}${dataset.download_url}`}
                target="_blank"
                rel="noreferrer"
                className="dataset-download"
              >
                Unduh Dataset
              </a>

            </div>

          )
        )

      )}

      {/* VARIABEL */}

      <div className="dataset-card">

        <h3>
          Variabel
          Analisis
          K-Means
        </h3>

        <p>
          Variabel
          numerik yang
          digunakan
          dalam proses
          clustering
          aktivitas
          ekonomi.
        </p>

        <ul>

          <li>
            Total UMKM
          </li>

          <li>
            Jumlah
            Stasiun
            (Mencakup KRL dan LRT)
          </li>

          <li>
            Jumlah Mall
          </li>

          <li>
            Jumlah Pasar
          </li>

          <li>
            Jumlah Halte
          </li>

        </ul>

      </div>

      {/* METODE */}

      <div className="dataset-card">

        <h3>
          Metode
          Analisis
        </h3>

        <p>
          Sistem
          menggunakan
          algoritma
          K-Means
          Clustering
          untuk
          mengelompokkan
          wilayah
          berdasarkan
          karakteristik
          aktivitas
          ekonomi.
        </p>

        <ul>

          <li>
            Algoritma:
            K-Means
          </li>

          <li>
            Jumlah
            Cluster: 3
          </li>

          <li>
            Magnet
            Rendah
          </li>

          <li>
            Magnet
            Sedang
          </li>

          <li>
            Magnet
            Tinggi
          </li>

        </ul>

      </div>

      {/* OUTPUT */}

      <div className="dataset-card full-width">

        <h3>
          Output
          Sistem
        </h3>

        <p>
          Hasil
          analisis
          ditampilkan
          dalam bentuk
          dashboard
          Web GIS
          interaktif.
        </p>

        <ul>

          <li>
            Choropleth
            Magnet
            Aktivitas
          </li>

          <li>
            Statistik
            per
            Kecamatan
          </li>

          <li>
            Visualisasi
            Fasilitas
            Ekonomi
          </li>

          <li>
            Perbandingan
            Wilayah
          </li>

          <li>
            Analisis
            Cluster
          </li>

        </ul>

      </div>

    </div>

  </div>
</div>

);
}
