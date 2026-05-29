from pydantic import BaseModel, field_validator
from typing import Optional, Dict, Any, List

# ──────────────────────────────────────────────
# Request: tambah titik fasilitas baru (POST)
# Frontend kirim lat/lon, bukan geometry langsung
# ──────────────────────────────────────────────
class FasilitasCreate(BaseModel):
    osm_id: Optional[str] = None
    nama_fasilitas: str
    amenity: Optional[str] = None
    shop: Optional[str] = None
    railway: Optional[str] = None
    jenis_fasilitas: str            
    kecamatan_id: Optional[int] = None
    lat: float                      
    lon: float                      

    @field_validator("jenis_fasilitas")
    @classmethod
    def validasi_jenis(cls, v):
        allowed = {
            "kuliner", "mall", "supermarket",
            "pasar", "stasiun_lrt", "terminal_halte", "lainnya"
        }
        if v not in allowed:
            raise ValueError(f"jenis_fasilitas harus salah satu dari: {allowed}")
        return v

# ──────────────────────────────────────────────
# Response: data fasilitas biasa 
# ──────────────────────────────────────────────
class FasilitasResponse(BaseModel):
    id: int # SINKRON: Gunakan 'id' sesuai database, bukan 'fasilitas_id'
    osm_id: Optional[str] = None
    nama_fasilitas: Optional[str] = None
    amenity: Optional[str] = None
    shop: Optional[str] = None
    railway: Optional[str] = None
    jenis_fasilitas: str
    kecamatan_id: Optional[int] = None
    # Ubah str menjadi Dict agar otomatis terurai jadi GeoJSON di browser
    geom: Optional[Dict[str, Any]] = None 

    class Config:
        from_attributes = True

# ──────────────────────────────────────────────
# Response: properties dalam GeoJSON Feature
# Berisi semua info fasilitas tanpa geometry
# ──────────────────────────────────────────────
class FasilitasProperties(BaseModel):
    id: int
    nama_fasilitas: Optional[str] = None
    jenis_fasilitas: Optional[str] = None
    amenity: Optional[str] = None
    shop: Optional[str] = None
    railway: Optional[str] = None
    kecamatan_id: Optional[int] = None

# ──────────────────────────────────────────────
# Response: satu GeoJSON Feature untuk fasilitas
# geometry berisi Point { coordinates: [lon, lat] }
# ──────────────────────────────────────────────
class FasilitasFeature(BaseModel):
    type: str = "Feature"
    geometry: Optional[Dict[str, Any]] = None  # Titik koordinat Leaflet
    properties: FasilitasProperties

# ──────────────────────────────────────────────
# Response: FeatureCollection hasil filter (UC2)
# Langsung dikirim ke Leaflet untuk render overlay
# ──────────────────────────────────────────────
class FasilitasGeoJSONCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[FasilitasFeature]

# ──────────────────────────────────────────────
# Response: daftar kategori unik
# Dipakai untuk mengisi checkbox di FilterPanel
# ──────────────────────────────────────────────
class KategoriListResponse(BaseModel):
    kategori: List[str]