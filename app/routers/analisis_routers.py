from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.analisis_service import AnalisisService
from app.schemas.analisis import (
    KlasterRequest,
    ChoroplethGeoJSON,
    HasilAnalisisResponse,
)

router = APIRouter(prefix="/analisis", tags=["Analisis K-Means"])


@router.post(
    "/run",
    response_model=ChoroplethGeoJSON,
    summary="Jalankan analisis K-Means (UC1)",
    description="""
**Inti UC1 — Visualisasi Magnet Aktivitas.**

Jalankan algoritma K-Means pada data kecamatan menggunakan fitur:
- Jumlah fasilitas ekonomi
- Jumlah stasiun, mall, pasar
- Total UMKM

Hasil disimpan ke tabel `hasil_analisis` dan `detail_analisis`,
lalu dikembalikan sebagai **GeoJSON choropleth** siap render di Leaflet.

Setiap kecamatan mendapat:
- `cluster_label`: 0 (Rendah), 1 (Sedang), 2 (Tinggi)
- `warna`: hex color untuk choropleth
- `silhouette_score`: evaluasi kualitas clustering

**Contoh request body:**
```json
{ "jumlah_k": 3, "keterangan": "Analisis semester ganjil 2024" }
```
    """,
)
@router.post("/run", response_model=ChoroplethGeoJSON, summary="Jalankan analisis K-Means (UC1)")
def run_analisis(request: KlasterRequest, db: Session = Depends(get_db)):
    service = AnalisisService(db)
    try:
        # Ekstrak nilai secara eksplisit agar sinkron dengan parameter Service Layer Anda
        return service.run_kmeans(
            jumlah_k=request.jumlah_k, 
            keterangan=request.keterangan
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get(
    "/choropleth",
    response_model=ChoroplethGeoJSON,
    summary="Ambil choropleth dari hasil analisis terakhir (UC1)",
    description="""
Kembalikan GeoJSON choropleth dari **run K-Means terakhir** yang tersimpan di database,
tanpa menjalankan ulang algoritma.

Dipakai saat:
- User membuka aplikasi (peta langsung tampil dengan warna klaster)
- User refresh halaman setelah analisis sebelumnya sudah ada
    """,
)
def get_choropleth(db: Session = Depends(get_db)):
    service = AnalisisService(db)
    result  = service.get_cached_choropleth()
    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Belum ada hasil analisis. Jalankan POST /analisis/run terlebih dahulu."
        )
    return result


@router.get(
    "/riwayat",
    response_model=list[HasilAnalisisResponse],
    summary="Riwayat semua run analisis",
    description="""
Kembalikan list semua run K-Means yang pernah dilakukan,
diurutkan dari yang terbaru.
Berisi metadata: tanggal, jumlah K, silhouette score, dan keterangan.
    """,
)
def get_riwayat(db: Session = Depends(get_db)):
    service = AnalisisService(db)
    return service.get_riwayat()
