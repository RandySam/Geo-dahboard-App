from pydantic import BaseModel, Field
from typing import Any, Optional
from datetime import datetime


# ──────────────────────────────────────────────
# Request: parameter untuk menjalankan K-Means
# Dikirim Frontend saat user klik tombol analisis
# ──────────────────────────────────────────────
class KlasterRequest(BaseModel):
    jumlah_k: int = Field(default=3, ge=2, le=10,
                          description="Jumlah klaster K-Means (minimal 2, maksimal 10)")
    keterangan: Optional[str] = None   # Catatan opsional untuk run ini


# ──────────────────────────────────────────────
# Response: metadata satu kali run K-Means
# Mewakili satu baris di tabel hasil_analisis
# ──────────────────────────────────────────────
class HasilAnalisisResponse(BaseModel):
    hasil_id: int
    tanggal_analisis: datetime
    jumlah_k: int
    silhouette_score: Optional[float] = None
    keterangan: Optional[str] = None

    class Config:
        from_attributes = True


# ──────────────────────────────────────────────
# Response: detail klaster per kecamatan
# Mewakili satu baris di tabel detail_analisis
# ──────────────────────────────────────────────
class DetailAnalisisResponse(BaseModel):
    detail_id: int
    analisis_id: int
    kecamatan_id: int
    cluster_label: int              # 0 = rendah, 1 = sedang, 2 = tinggi

    class Config:
        from_attributes = True


# ──────────────────────────────────────────────
# Response: properties choropleth per kecamatan
# Berisi info klaster + statistik untuk pop-up
# ──────────────────────────────────────────────
class ChoroplethProperties(BaseModel):
    kecamatan_id: int
    nama_kecamatan: str
    cluster_label: int
    cluster_label_text: str         # "Magnet Rendah" | "Magnet Sedang" | "Magnet Tinggi"
    warna: str                      # hex color untuk choropleth Leaflet
    jumlah_fasilitas: int
    jumlah_stasiun: int
    jumlah_mall: int
    jumlah_pasar: int
    total_umkm: Optional[int] = None
    jumlah_lrt: Optional[int] = Field(default=0)
    jumlah_terminal: Optional[int] = Field(default=0)
    jumlah_halte: Optional[int] = Field(default=0)
    silhouette_score: Optional[float] = None

    class Config:
        from_attributes = True


# ──────────────────────────────────────────────
# Response: satu GeoJSON Feature choropleth
# geometry berisi MultiPolygon batas kecamatan
# ──────────────────────────────────────────────
class ChoroplethFeature(BaseModel):
    type: str = "Feature"
    geometry: Any                   # MultiPolygon dari ST_AsGeoJSON
    properties: ChoroplethProperties


# ──────────────────────────────────────────────
# Response: FeatureCollection choropleth (UC1)
# Langsung dikirim ke Leaflet untuk render warna klaster
# ──────────────────────────────────────────────
class ChoroplethGeoJSON(BaseModel):
    type: str = "FeatureCollection"
    features: list[ChoroplethFeature]
    # Metadata run analisis (ditampilkan di legend / info box)
    metadata: HasilAnalisisResponse
