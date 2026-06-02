from sqlalchemy.orm import Session

from app.repositories.fasilitas_repository import FasilitasRepository
from app.schemas.fasilitas import (
    FasilitasCreate,
    FasilitasResponse,
    FasilitasProperties,
    FasilitasFeature,
    FasilitasGeoJSONCollection,
    KategoriListResponse,
)


class FasilitasService:
    def __init__(self, db: Session):
        self.repo = FasilitasRepository(db)

    # ──────────────────────────────────────────────
    # UC2 — Filter & Overlay
    # Terima list jenis yang dipilih user dari checkbox,
    # kembalikan GeoJSON FeatureCollection titik-titiknya
    # Contoh: jenis_list = ["mall", "stasiun_lrt", "kuliner"]
    # ──────────────────────────────────────────────
    def get_geojson_by_jenis(self, jenis_list: list[str]) -> FasilitasGeoJSONCollection:
        rows = self.repo.get_by_jenis(jenis_list)

        features = []
        for r in rows:
            properties = FasilitasProperties(
                id=r.id,
                nama_fasilitas=r.nama_fasilitas,
                jenis_fasilitas=r.jenis_fasilitas,
                amenity=r.amenity,
                shop=r.shop,
                railway=r.railway,
                kecamatan_id=r.kecamatan_id,
            )
            features.append(FasilitasFeature(
                geometry={
                    "type": "Point",
                    "coordinates": [r.lon, r.lat],   # GeoJSON: [lon, lat]
                },
                properties=properties,
            ))

        return FasilitasGeoJSONCollection(features=features)

    # ──────────────────────────────────────────────
    # UC2 — Ambil daftar kategori unik
    # Dipakai untuk mengisi checkbox FilterPanel di React
    # ──────────────────────────────────────────────
    def get_kategori_list(self) -> KategoriListResponse:
        kategori = self.repo.get_jenis_list()
        return KategoriListResponse(kategori=kategori)

    # ──────────────────────────────────────────────
    # Ambil semua fasilitas sebagai GeoJSON
    # Dipakai jika ingin tampilkan semua titik sekaligus
    # ──────────────────────────────────────────────
    def get_all_geojson(self) -> FasilitasGeoJSONCollection:
        rows = self.repo.get_all_as_geojson()

        features = []
        for r in rows:
            properties = FasilitasProperties(
                id=r.id,
                nama_fasilitas=r.nama_fasilitas,
                jenis_fasilitas=r.jenis_fasilitas,
                amenity=r.amenity,
                shop=r.shop,
                railway=r.railway,
                kecamatan_id=r.kecamatan_id,
            )
            features.append(FasilitasFeature(
                geometry={
                    "type": "Point",
                    "coordinates": [r.lon, r.lat],
                },
                properties=properties,
            ))

        return FasilitasGeoJSONCollection(features=features)

    # ──────────────────────────────────────────────
    # Tambah titik fasilitas baru
    # lat/lon dari request dikonversi ke geometry di repository
    # ──────────────────────────────────────────────
    def create(self, data: FasilitasCreate) -> FasilitasResponse:
        obj = self.repo.create(
            nama_fasilitas=data.nama_fasilitas,
            jenis_fasilitas=data.jenis_fasilitas,
            lat=data.lat,
            lon=data.lon,
            osm_id=data.osm_id,
            amenity=data.amenity,
            shop=data.shop,
            railway=data.railway,
            kecamatan_id=data.kecamatan_id,
        )
        return FasilitasResponse.model_validate(obj)
