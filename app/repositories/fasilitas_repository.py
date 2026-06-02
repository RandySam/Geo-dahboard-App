from sqlalchemy.orm import Session
from sqlalchemy import text, func
from typing import Optional

from app.models.fasilitas_ekonomi import FasilitasEkonomi


class FasilitasRepository:
    def __init__(self, db: Session):
        self.db = db

    # ──────────────────────────────────────────────
    # Tambah satu titik fasilitas baru
    # lat/lon dikonversi ke geometry Point PostGIS
    # ──────────────────────────────────────────────
    def create(
        self,
        nama_fasilitas: str,
        jenis_fasilitas: str,
        lat: float,
        lon: float,
        osm_id: str = None,
        amenity: str = None,
        shop: str = None,
        railway: str = None,
        kecamatan_id: int = None,
    ) -> FasilitasEkonomi:
        obj = FasilitasEkonomi(
            osm_id=osm_id,
            nama_fasilitas=nama_fasilitas,
            amenity=amenity,
            shop=shop,
            railway=railway,
            jenis_fasilitas=jenis_fasilitas,
            kecamatan_id=kecamatan_id,
            geom=func.ST_SetSRID(func.ST_MakePoint(lon, lat), 4326),
        )
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    # ──────────────────────────────────────────────
    # Ambil semua fasilitas (tanpa geometry)
    # ──────────────────────────────────────────────
    def get_all(self) -> list[FasilitasEkonomi]:
        return self.db.query(FasilitasEkonomi).all()

    # ──────────────────────────────────────────────
    # Ambil fasilitas berdasarkan satu / banyak jenis
    # Dipakai untuk filter & overlay UC2
    # Contoh: jenis_list = ["mall", "stasiun_lrt"]
    # ──────────────────────────────────────────────
    def get_by_jenis(self, jenis_list: list[str]) -> list:
        # Pakai parameterized query untuk keamanan
        placeholders = ", ".join([f":j{i}" for i in range(len(jenis_list))])
        params = {f"j{i}": v for i, v in enumerate(jenis_list)}

        rows = self.db.execute(text(f"""
            SELECT
                f.id,
                f.nama_fasilitas,
                f.jenis_fasilitas,
                f.amenity,
                f.shop,
                f.railway,
                f.kecamatan_id,
                ST_X(f.geom) AS lon,
                ST_Y(f.geom) AS lat
            FROM fasilitas_ekonomi f
            WHERE f.jenis_fasilitas IN ({placeholders})
            ORDER BY f.jenis_fasilitas, f.nama_fasilitas
        """), params).fetchall()
        return rows

    # ──────────────────────────────────────────────
    # Ambil semua fasilitas sebagai GeoJSON rows
    # ──────────────────────────────────────────────
    def get_all_as_geojson(self) -> list:
        rows = self.db.execute(text("""
            SELECT
                f.id,
                f.nama_fasilitas,
                f.jenis_fasilitas,
                f.amenity,
                f.shop,
                f.railway,
                f.kecamatan_id,
                ST_X(f.geom) AS lon,
                ST_Y(f.geom) AS lat
            FROM fasilitas_ekonomi f
            ORDER BY f.jenis_fasilitas
        """)).fetchall()
        return rows

    # ──────────────────────────────────────────────
    # Ambil daftar jenis_fasilitas yang unik
    # Dipakai untuk mengisi checkbox FilterPanel (UC2)
    # ──────────────────────────────────────────────
    def get_jenis_list(self) -> list[str]:
        rows = (
            self.db.query(FasilitasEkonomi.jenis_fasilitas)
            .distinct()
            .order_by(FasilitasEkonomi.jenis_fasilitas)
            .all()
        )
        return [r[0] for r in rows if r[0] is not None]

    # ──────────────────────────────────────────────
    # Hitung jumlah fasilitas per kecamatan
    # Dipakai sebagai fitur input K-Means (UC1)
    # Return: { kecamatan_id: jumlah_fasilitas }
    # ──────────────────────────────────────────────
    def count_per_kecamatan(self) -> dict[int, int]:
        rows = self.db.execute(text("""
            SELECT kecamatan_id, COUNT(*) AS jumlah
            FROM fasilitas_ekonomi
            WHERE kecamatan_id IS NOT NULL
            GROUP BY kecamatan_id
        """)).fetchall()
        return {r.kecamatan_id: r.jumlah for r in rows}

    # ──────────────────────────────────────────────
    # Hitung jumlah fasilitas per jenis per kecamatan
    # Dipakai untuk detail statistik pop-up (UC3)
    # Return: { "mall": 3, "kuliner": 12, ... }
    # ──────────────────────────────────────────────
    def count_per_jenis_by_kecamatan(self, kecamatan_id: int) -> dict[str, int]:
        rows = self.db.execute(text("""
            SELECT jenis_fasilitas, COUNT(*) AS jumlah
            FROM fasilitas_ekonomi
            WHERE kecamatan_id = :kid
            GROUP BY jenis_fasilitas
            ORDER BY jumlah DESC
        """), {"kid": kecamatan_id}).fetchall()
        return {r.jenis_fasilitas: r.jumlah for r in rows}
