from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional

from app.models.kecamatan import Kecamatan


class KecamatanRepository:
    def __init__(self, db: Session):
        self.db = db

    # ──────────────────────────────────────────────
    # Ambil semua kecamatan (tanpa geometry)
    # Dipakai untuk list / dropdown
    # ──────────────────────────────────────────────
    def get_all(self) -> list[Kecamatan]:
        return self.db.query(Kecamatan).order_by(Kecamatan.nama_kecamatan).all()

    # ──────────────────────────────────────────────
    # Ambil satu kecamatan by ID
    # ──────────────────────────────────────────────
    def get_by_id(self, kecamatan_id: int) -> Optional[Kecamatan]:
        return (
            self.db.query(Kecamatan)
            .filter(Kecamatan.kecamatan_id == kecamatan_id)
            .first()
        )

    # ──────────────────────────────────────────────
    # Ambil semua kecamatan sebagai GeoJSON rows
    # ST_AsGeoJSON konversi geometry → JSON string
    # Dipakai untuk render batas wilayah di Leaflet
    # ──────────────────────────────────────────────
    def get_all_as_geojson(self) -> list:
        rows = self.db.execute(text("""
            SELECT
                k.kecamatan_id,
                k.nama_kecamatan,
                k.luas_km2,
                k.total_umkm,
                k.jumlah_stasiun,
                k.jumlah_mall,
                k.jumlah_pasar,
                ST_AsGeoJSON(k.geom)::json AS geometry
            FROM kecamatan k
            WHERE k.geom IS NOT NULL
            ORDER BY k.nama_kecamatan
        """)).fetchall()
        return rows

    # ──────────────────────────────────────────────
    # Ambil satu kecamatan dengan geometry-nya
    # Dipakai untuk pop-up UC3
    # ──────────────────────────────────────────────
    def get_by_id_with_geom(self, kecamatan_id: int):
        row = self.db.execute(text("""
            SELECT
                k.kecamatan_id,
                k.nama_kecamatan,
                k.luas_km2,
                k.total_umkm,
                k.jumlah_stasiun,
                k.jumlah_mall,
                k.jumlah_pasar,
                ST_AsGeoJSON(k.geom)::json AS geometry
            FROM kecamatan k
            WHERE k.kecamatan_id = :kid
        """), {"kid": kecamatan_id}).fetchone()
        return row

    # ──────────────────────────────────────────────
    # Ambil semua centroid kecamatan
    # Dipakai K-Means untuk feature matrix (lat, lon)
    # ──────────────────────────────────────────────
    def get_all_centroids(self) -> list:
        rows = self.db.execute(text("""
            SELECT
                k.kecamatan_id,
                k.nama_kecamatan,
                k.luas_km2,
                k.total_umkm,
                k.jumlah_stasiun,
                k.jumlah_mall,
                k.jumlah_pasar,
                k.jumlah_halte,
                ST_X(ST_Centroid(ST_Transform(k.geom, 4326))) AS lon,
                ST_Y(ST_Centroid(ST_Transform(k.geom, 4326))) AS lat
            FROM kecamatan k
            WHERE k.geom IS NOT NULL
            ORDER BY k.kecamatan_id
        """)).fetchall()
        return rows

    # ──────────────────────────────────────────────
    # Hitung jumlah fasilitas ekonomi per kecamatan
    # Dipakai untuk statistik pop-up UC3
    # ──────────────────────────────────────────────
    def count_fasilitas(self, kecamatan_id: int) -> int:
        row = self.db.execute(text("""
            SELECT COUNT(*) FROM fasilitas_ekonomi
            WHERE kecamatan_id = :kid
        """), {"kid": kecamatan_id}).scalar()
        return row or 0
    
    @staticmethod
    def get_features_for_clustering(db: Session):
        """
        Menarik seluruh variabel numerik dari 12 kecamatan 
        sebagai matriks input (X) untuk algoritma K-Means.
        """
        query = text("""
            SELECT 
                kecamatan_id,
                nama_kecamatan,
                luas_km2,
                penduduk_ribu,
                kepadatan_per_km2,
                total_umkm,
                jumlah_mall,
                jumlah_pasar,
                jumlah_stasiun
            FROM kecamatan
            ORDER BY kecamatan_id ASC;
        """)
        return db.execute(query).fetchall()
