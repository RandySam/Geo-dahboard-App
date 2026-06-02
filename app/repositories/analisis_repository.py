from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional

from app.models.hasil_analisis import HasilAnalisis
from app.models.detail_analisis import DetailAnalisis


class AnalisisRepository:
    def __init__(self, db: Session):
        self.db = db

    # ════════════════════════════════════════════════
    # HASIL ANALISIS — metadata per run K-Means
    # ════════════════════════════════════════════════

    # ──────────────────────────────────────────────
    # Simpan satu run K-Means baru ke tabel hasil_analisis
    # Return: objek HasilAnalisis yang baru disimpan
    # ──────────────────────────────────────────────
    def create_hasil(
        self,
        jumlah_k: int,
        silhouette_score: float = None,
        keterangan: str = None,
    ) -> HasilAnalisis:
        obj = HasilAnalisis(
            jumlah_k=jumlah_k,
            silhouette_score=silhouette_score,
            keterangan=keterangan,
        )
        self.db.add(obj)
        self.db.flush()     # Flush dulu agar hasil_id tersedia sebelum commit
        return obj

    # ──────────────────────────────────────────────
    # Ambil run analisis terbaru
    # Dipakai untuk render choropleth tanpa re-run
    # ──────────────────────────────────────────────
    def get_latest_hasil(self) -> Optional[HasilAnalisis]:
        return (
            self.db.query(HasilAnalisis)
            .order_by(HasilAnalisis.tanggal_analisis.desc())
            .first()
        )

    # ──────────────────────────────────────────────
    # Ambil hasil analisis by ID
    # ──────────────────────────────────────────────
    def get_hasil_by_id(self, hasil_id: int) -> Optional[HasilAnalisis]:
        return (
            self.db.query(HasilAnalisis)
            .filter(HasilAnalisis.hasil_id == hasil_id)
            .first()
        )

    # ──────────────────────────────────────────────
    # Ambil semua riwayat run analisis
    # Dipakai jika ada fitur history analisis
    # ──────────────────────────────────────────────
    def get_all_hasil(self) -> list[HasilAnalisis]:
        return (
            self.db.query(HasilAnalisis)
            .order_by(HasilAnalisis.tanggal_analisis.desc())
            .all()
        )

    # ════════════════════════════════════════════════
    # DETAIL ANALISIS — hasil klaster per kecamatan
    # ════════════════════════════════════════════════

    # ──────────────────────────────────────────────
    # Simpan banyak detail sekaligus (bulk insert)
    # Dipanggil setelah K-Means selesai dijalankan
    # details: list of dict { analisis_id, kecamatan_id, cluster_label }
    # ──────────────────────────────────────────────
    def create_details_bulk(self, details: list[dict]) -> None:
        objs = [
            DetailAnalisis(
                analisis_id=d["analisis_id"],
                kecamatan_id=d["kecamatan_id"],
                cluster_label=d["cluster_label"],
            )
            for d in details
        ]
        self.db.bulk_save_objects(objs)

    # ──────────────────────────────────────────────
    # Ambil detail analisis berdasarkan hasil_id
    # Dipakai untuk membangun GeoJSON choropleth
    # ──────────────────────────────────────────────
    def get_details_by_hasil_id(self, hasil_id: int) -> list[DetailAnalisis]:
        return (
            self.db.query(DetailAnalisis)
            .filter(DetailAnalisis.analisis_id == hasil_id)
            .all()
        )

    # ──────────────────────────────────────────────
    # Ambil detail analisis terbaru per kecamatan
    # Join ke hasil_analisis untuk ambil run terakhir
    # Dipakai untuk pop-up UC3
    # ──────────────────────────────────────────────
    def get_latest_detail_by_kecamatan(self, kecamatan_id: int) -> Optional[DetailAnalisis]:
        return (
            self.db.query(DetailAnalisis)
            .join(HasilAnalisis, DetailAnalisis.analisis_id == HasilAnalisis.hasil_id)
            .filter(DetailAnalisis.kecamatan_id == kecamatan_id)
            .order_by(HasilAnalisis.tanggal_analisis.desc())
            .first()
        )

    # ──────────────────────────────────────────────
    # Ambil semua detail run terakhir + geometry kecamatan
    # Query ini langsung kembalikan data siap pakai
    # untuk membangun GeoJSON choropleth (UC1)
    # ──────────────────────────────────────────────
    def get_latest_choropleth_data(self):
        return self.db.execute(text("""
            SELECT 
                ha.hasil_id,
                k.kecamatan_id, 
                k.nama_kecamatan, 
                da.cluster_label, 
                ha.jumlah_k, 
                ha.silhouette_score, 
                ha.tanggal_analisis, 
                ha.keterangan,
                -- Pastikan kolom-kolom ini ada di SELECT agar bisa diakses di Service
                k.jumlah_stasiun, 
                k.jumlah_mall, 
                k.jumlah_pasar, 
                k.total_umkm,
                k.jumlah_halte,
                ST_AsGeoJSON(k.geom)::json AS geometry,
                COUNT(fe.id) AS jumlah_fasilitas,
		
		COUNT(CASE WHEN LOWER(TRIM(fe.jenis_fasilitas)) = 'mall' THEN 1 END) AS jumlah_mall_real,
    		COUNT(CASE WHEN LOWER(TRIM(fe.jenis_fasilitas)) = 'supermarket' THEN 1 END) AS jumlah_supermarket,
    		COUNT(CASE WHEN LOWER(TRIM(fe.jenis_fasilitas)) = 'pasar' THEN 1 END) AS jumlah_pasar_real,
    		COUNT(CASE WHEN LOWER(TRIM(fe.jenis_fasilitas)) = 'kuliner' THEN 1 END) AS jumlah_kuliner,
		COUNT(CASE WHEN LOWER(TRIM(fe.jenis_fasilitas)) IN ('stasiun_lrt', 'terminal_halte') THEN 1 END) AS jumlah_transportasi
            FROM kecamatan k
            JOIN detail_analisis da ON da.kecamatan_id = k.kecamatan_id
            JOIN hasil_analisis ha ON ha.hasil_id = da.analisis_id
            LEFT JOIN fasilitas_ekonomi fe ON fe.kecamatan_id = k.kecamatan_id
            WHERE ha.hasil_id = (SELECT MAX(hasil_id) FROM hasil_analisis)
            GROUP BY 
                ha.hasil_id, k.kecamatan_id, k.nama_kecamatan, k.luas_km2,
                k.total_umkm, k.jumlah_stasiun, k.jumlah_mall, k.jumlah_pasar,
                da.cluster_label, ha.jumlah_k, ha.silhouette_score, 
                ha.tanggal_analisis, ha.keterangan, k.geom
        """)).fetchall()

    # ──────────────────────────────────────────────
    # Hapus semua detail dari satu run tertentu
    # Opsional: dipakai jika ada fitur hapus riwayat
    # ──────────────────────────────────────────────
    def delete_details_by_hasil_id(self, hasil_id: int) -> None:
        self.db.query(DetailAnalisis).filter(
            DetailAnalisis.analisis_id == hasil_id
        ).delete()

    def create_detail(self, analisis_id: int, kecamatan_id: int, cluster_label: int) -> DetailAnalisis:
        detail = DetailAnalisis(
            analisis_id=analisis_id,
            kecamatan_id=kecamatan_id,
            cluster_label=cluster_label
        )
        self.db.add(detail)
        # Jangan commit di sini, kita commit sekaligus di Service Layer
        # setelah semua detail berhasil dimasukkan (bulk operation)
        return detail
