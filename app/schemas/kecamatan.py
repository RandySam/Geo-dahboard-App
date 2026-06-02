from pydantic import BaseModel
from typing import Optional, Dict, Any

# ──────────────────────────────────────────────
# 1. Skema Input K-Means (Strict / Wajib 11 Fitur)
# ──────────────────────────────────────────────
class KecamatanClusteringInput(BaseModel):
    kecamatan_id: int
    nama_kecamatan: str
    luas_km2: float
    penduduk_ribu: float
    kepadatan_per_km2: int
    total_umkm: int
    jumlah_mall: int
    jumlah_pasar: int
    jumlah_stasiun: int
    jumlah_lrt: int
    jumlah_terminal: int

    class Config:
        from_attributes = True

# ──────────────────────────────────────────────
# 2. Skema Referensi & Properti GeoJSON (Fleksibel)
# ──────────────────────────────────────────────
class KecamatanResponse(BaseModel):
    kecamatan_id: int
    nama_kecamatan: str
    luas_km2: Optional[float] = None
    total_umkm: Optional[int] = None
    jumlah_stasiun: Optional[int] = None
    jumlah_mall: Optional[int] = None
    jumlah_pasar: Optional[int] = None

    class Config:
        from_attributes = True

# ──────────────────────────────────────────────
# 3. Skema Statistik untuk Pop-up (UC3)
# ──────────────────────────────────────────────
class KecamatanStatistikResponse(BaseModel):
    kecamatan_id: int
    nama_kecamatan: str
    luas_km2: Optional[float] = None
    total_umkm: Optional[int] = None
    jumlah_stasiun: Optional[int] = None
    jumlah_mall: Optional[int] = None
    jumlah_pasar: Optional[int] = None
    cluster_label: Optional[int] = None
    jumlah_fasilitas_ekonomi: Optional[int] = None

    class Config:
        from_attributes = True

# ──────────────────────────────────────────────
# 4. Struktur GeoJSON untuk Frontend Leaflet
# ──────────────────────────────────────────────
class KecamatanFeature(BaseModel):
    type: str = "Feature"
    geometry: Optional[Dict[str, Any]] = None 
    properties: KecamatanResponse

class KecamatanGeoJSONCollection(BaseModel):
    type: str = "FeatureCollection"
    features: list[KecamatanFeature]