from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.kecamatan_service import KecamatanService
from app.schemas.kecamatan import (
    KecamatanGeoJSONCollection,
    KecamatanStatistikResponse,
    KecamatanResponse,
)

router = APIRouter(prefix="/kecamatan", tags=["Kecamatan"])


@router.get(
    "/",
    response_model=list[KecamatanResponse],
    summary="Daftar semua kecamatan",
    description="Kembalikan list semua kecamatan tanpa geometry. Dipakai untuk dropdown atau referensi.",
)
def get_all_kecamatan(db: Session = Depends(get_db)):
    service = KecamatanService(db)
    return service.get_all()


@router.get(
    "/geojson",
    response_model=KecamatanGeoJSONCollection,
    summary="GeoJSON batas wilayah semua kecamatan (UC1 & UC2)",
    description="""
Kembalikan FeatureCollection GeoJSON berisi polygon batas semua kecamatan.
Dipakai oleh Leaflet untuk:
- Render layer batas wilayah
- Dasar choropleth setelah K-Means dijalankan
    """,
)
def get_geojson(db: Session = Depends(get_db)):
    service = KecamatanService(db)
    return service.get_all_geojson()


@router.get(
    "/{kecamatan_id}/statistik",
    response_model=KecamatanStatistikResponse,
    summary="Detail statistik kecamatan (UC3)",
    description="""
Dipanggil saat user **klik salah satu wilayah** di peta.
Kembalikan data statistik lengkap kecamatan:
- Data statis (luas, UMKM, jumlah stasiun/mall/pasar)
- Hasil klaster terakhir dari K-Means
- Jumlah titik fasilitas ekonomi di tabel fasilitas
    """,
)
def get_statistik(kecamatan_id: int, db: Session = Depends(get_db)):
    service = KecamatanService(db)
    result  = service.get_statistik(kecamatan_id)
    if result is None:
        raise HTTPException(
            status_code=404,
            detail=f"Kecamatan dengan tidak ditemukan."
        )
    return result
