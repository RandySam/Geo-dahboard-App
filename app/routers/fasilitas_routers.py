from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.services.fasilitas_service import FasilitasService
from app.schemas.fasilitas import (
    FasilitasCreate,
    FasilitasResponse,
    FasilitasGeoJSONCollection,
    KategoriListResponse,
)

router = APIRouter(prefix="/fasilitas", tags=["Fasilitas Ekonomi"])


@router.get(
    "/kategori",
    response_model=KategoriListResponse,
    summary="Daftar kategori fasilitas",
    description="""
Kembalikan list semua nilai `jenis_fasilitas` yang unik dari database.
Dipakai Frontend untuk mengisi **checkbox FilterPanel** (UC2).

Contoh response:
```json
{ "kategori": ["kuliner", "mall", "pasar", "stasiun_lrt", "supermarket", "terminal_halte"] }
```
    """,
)

# Pastikan ini ada di fasilitas_service.py Anda:
def get_kategori_list(self) -> KategoriListResponse:
    kategori = self.repo.get_jenis_list()
    return KategoriListResponse(kategori=kategori)

def get_kategori(db: Session = Depends(get_db)):
    service = FasilitasService(db)
    return service.get_kategori_list()


@router.get(
    "/filter",
    response_model=FasilitasGeoJSONCollection,
    summary="Filter titik fasilitas berdasarkan kategori (UC2)",
    description="""
**Inti UC2 — Filter & Overlay.**

Terima satu atau lebih kategori dari query parameter, kembalikan
GeoJSON FeatureCollection berisi titik-titik yang sesuai untuk
di-render sebagai overlay layer di Leaflet.

**Contoh request:**
```
GET /fasilitas/filter?jenis=mall&jenis=stasiun_lrt&jenis=kuliner
```

**Kategori yang tersedia:**
`kuliner` | `mall` | `supermarket` | `pasar` | `stasiun_lrt` | `terminal_halte` | `lainnya`
    """,
)
def filter_fasilitas(
    jenis: List[str] = Query(
        ...,
        description="Satu atau lebih jenis fasilitas. Contoh: ?jenis=mall&jenis=stasiun_lrt"
    ),
    db: Session = Depends(get_db),
):
    if not jenis:
        raise HTTPException(
            status_code=400,
            detail="Parameter 'jenis' wajib diisi minimal satu kategori."
        )
    service = FasilitasService(db)
    return service.get_geojson_by_jenis(jenis)


@router.get(
    "/",
    response_model=FasilitasGeoJSONCollection,
    summary="Semua titik fasilitas sebagai GeoJSON",
    description="Kembalikan seluruh titik fasilitas ekonomi tanpa filter.",
)
def get_all_fasilitas(db: Session = Depends(get_db)):
    service = FasilitasService(db)
    return service.get_all_geojson()


@router.post(
    "/",
    response_model=FasilitasResponse,
    status_code=201,
    summary="Tambah titik fasilitas baru",
    description="""
Tambah satu titik fasilitas baru ke database.
Koordinat dikirim sebagai `lat` dan `lon` (float),
dikonversi otomatis ke geometry `POINT` PostGIS di backend.
    """,
)
def create_fasilitas(data: FasilitasCreate, db: Session = Depends(get_db)):
    service = FasilitasService(db)
    return service.create(data)
