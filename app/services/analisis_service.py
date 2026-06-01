import numpy as np
from sqlalchemy.orm import Session
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.metrics import silhouette_score
from app.schemas.analisis import HasilAnalisisResponse

from app.repositories.kecamatan_repository import KecamatanRepository
from app.repositories.fasilitas_repository import FasilitasRepository
from app.repositories.analisis_repository import AnalisisRepository
from app.schemas.analisis import (
    KlasterRequest,
    HasilAnalisisResponse,
    ChoroplethProperties,
    ChoroplethFeature,
    ChoroplethGeoJSON,
)

# ──────────────────────────────────────────────
# Mapping cluster_label → label teks & warna
# Label ditentukan SETELAH K-Means selesai
# berdasarkan ranking skor magnet rata-rata
# 0 = terendah, 1 = sedang, 2 = tertinggi
# ──────────────────────────────────────────────
CLUSTER_LABEL_TEXT = {
    0: "Magnet Rendah",
    1: "Magnet Sedang",
    2: "Magnet Tinggi",
}
CLUSTER_WARNA = {
    0: "#d73027",   # merah   – magnet rendah
    1: "#fee08b",   # kuning  – magnet sedang
    2: "#1a9850",   # hijau   – magnet tinggi
}


class AnalisisService:
    def __init__(self, db: Session):
        self.db             = db
        self.kecamatan_repo = KecamatanRepository(db)
        self.fasilitas_repo = FasilitasRepository(db)
        self.analisis_repo  = AnalisisRepository(db)

    # ──────────────────────────────────────────────
    # UC1 — Jalankan K-Means & simpan hasilnya
    # Alur:
    # 1. Ambil data fitur per kecamatan dari DB
    # 2. Normalisasi dengan MinMaxScaler
    # 3. Jalankan K-Means
    # 4. Hitung silhouette score
    # 5. Remap label (0=rendah, 1=sedang, 2=tinggi)
    # 6. Simpan ke hasil_analisis + detail_analisis
    # 7. Bangun & kembalikan GeoJSON choropleth
    # ──────────────────────────────────────────────
    def run_kmeans(
        self,
        jumlah_k: int,
        keterangan: str = None,
    ) -> HasilAnalisisResponse:

        # ─────────────────────────────────────────────
        # 1. Ambil seluruh fitur kecamatan
        # ─────────────────────────────────────────────
        rows = self.kecamatan_repo.get_all_centroids()
        if not rows:
            raise ValueError("Tidak ada data kecamatan di database.")

        # ─────────────────────────────────────────────
        # 2. Susun matrix fitur numerik (Null Safety dari Teman)
        # Urutan WAJIB sama dengan bobot: UMKM, Pasar, Mall, Stasiun, Halte
        # ─────────────────────────────────────────────
        features_matrix = []
        for r in rows:
            features_matrix.append([
                float(r.total_umkm or 0),
                float(r.jumlah_pasar or 0),
                float(r.jumlah_mall or 0),
                float(r.jumlah_stasiun or 0),
                float(r.jumlah_halte or 0),
            ])

        X = np.array(features_matrix)

        # ─────────────────────────────────────────────
        # 3. Normalisasi Fitur (Skala 0-1)
        # ─────────────────────────────────────────────
        scaler = MinMaxScaler()
        X_scaled = scaler.fit_transform(X)

        # ─────────────────────────────────────────────
        # 4. PEMBOBOTAN MATEMATIS (LOGIKA ANDA - Skor 0.58)
        # UMKM (1.0), Pasar (1.5), Mall (3.0), Stasiun KA (2.5), Halte (1.5)
        # ─────────────────────────────────────────────
        bobot_array = np.array([1.0, 1.5, 3.0, 2.5, 1.5])
        X_weighted = X_scaled * bobot_array

        # ─────────────────────────────────────────────
        # 5. Jalankan K-Means menggunakan X_weighted
        # ─────────────────────────────────────────────
        kmeans = KMeans(
            n_clusters=jumlah_k,
            random_state=42,
            n_init=10,
            max_iter=300,
        )
        raw_labels = kmeans.fit_predict(X_weighted)

        unique_labels = len(set(raw_labels))
        if unique_labels > 1 and unique_labels < len(rows):
            # Evaluasi Silhouette juga menggunakan X_weighted
            score = float(silhouette_score(X_weighted, raw_labels))
        else:
            score = 0.0

        # ─────────────────────────────────────────────
        # 6. Ranking cluster berdasarkan magnet (Anti Label-Switching)
        # Evaluasi ranking tetap menggunakan X_scaled agar adil
        # ─────────────────────────────────────────────
        cluster_magnitudes = {}
        for label in range(jumlah_k):
            cluster_features = X_weighted[raw_labels == label]
            cluster_magnitudes[label] = float(np.mean(cluster_features))

        sorted_labels = sorted(cluster_magnitudes, key=cluster_magnitudes.get)

        label_mapping = {
            old_label: new_label
            for new_label, old_label in enumerate(sorted_labels)
        }
        final_labels = [label_mapping[label] for label in raw_labels]

        # ─────────────────────────────────────────────
        # 7. Simpan metadata hasil analisis
        # ─────────────────────────────────────────────
        hasil_db = self.analisis_repo.create_hasil(
            jumlah_k=jumlah_k,
            silhouette_score=score,
            keterangan=keterangan,
        )

        # ─────────────────────────────────────────────
        # 8. BULK INSERT DETAIL KLASTER (LOGIKA TEMAN - Map Fix)
        # ─────────────────────────────────────────────
        details = []
        for i, r in enumerate(rows):
            details.append({
                "analisis_id": hasil_db.hasil_id,
                "kecamatan_id": r.kecamatan_id,
                "cluster_label": final_labels[i],
            })

        self.analisis_repo.create_details_bulk(details)
        self.db.commit()

        # ─────────────────────────────────────────────
        # 9. Return GeoJSON hasil terbaru
        # ─────────────────────────────────────────────
        return self.get_cached_choropleth()

    # ──────────────────────────────────────────────
    # UC1 — Ambil hasil K-Means terakhir tanpa re-run
    # Dipakai saat user refresh halaman atau buka ulang
    # ──────────────────────────────────────────────
    def get_cached_choropleth(self) -> ChoroplethGeoJSON | None:
        rows = self.analisis_repo.get_latest_choropleth_data()
        if not rows:
            return None

        # Ambil metadata dari baris pertama (semua baris punya metadata sama)
        first = rows[0]
        hasil_response = HasilAnalisisResponse(
            hasil_id=first.hasil_id,
            tanggal_analisis=first.tanggal_analisis,
            jumlah_k=first.jumlah_k,
            silhouette_score=first.silhouette_score,
            keterangan=first.keterangan,
        )

        features = []
        for r in rows:
            if r.geometry is None:
                continue

            cluster_label = r.cluster_label
            properties = ChoroplethProperties(
                kecamatan_id=r.kecamatan_id,
                nama_kecamatan=r.nama_kecamatan,
                cluster_label=cluster_label,
                cluster_label_text=CLUSTER_LABEL_TEXT.get(cluster_label, str(cluster_label)),
                warna=CLUSTER_WARNA.get(cluster_label, "#cccccc"),
                jumlah_fasilitas=r.jumlah_fasilitas,
                jumlah_stasiun=r.jumlah_stasiun,
                jumlah_mall=r.jumlah_mall,
                jumlah_pasar=r.jumlah_pasar,
                total_umkm=r.total_umkm,
                silhouette_score=r.silhouette_score,
                jumlah_mall_real=r.jumlah_mall_real,
                jumlah_supermarket=r.jumlah_supermarket,
                jumlah_pasar_real=r.jumlah_pasar_real,
                jumlah_kuliner=r.jumlah_kuliner,
                jumlah_transportasi=r.jumlah_transportasi,
            )
            features.append(ChoroplethFeature(
                geometry=
                        json.loads(r.geometry)
                        if isinstance(
                            r.geometry,
                            str
                        )
                        else r.geometry,
                properties=properties,
            ))

        return ChoroplethGeoJSON(features=features, metadata=hasil_response)

    # ──────────────────────────────────────────────
    # Ambil riwayat semua run analisis
    # Opsional: untuk fitur history di dashboard
    # ──────────────────────────────────────────────
    def get_riwayat(self) -> list[HasilAnalisisResponse]:
        hasil_list = self.analisis_repo.get_all_hasil()
        return [
            HasilAnalisisResponse(
                hasil_id=h.hasil_id,
                tanggal_analisis=h.tanggal_analisis,
                jumlah_k=h.jumlah_k,
                silhouette_score=h.silhouette_score,
                keterangan=h.keterangan,
            )
            for h in hasil_list
        ]
