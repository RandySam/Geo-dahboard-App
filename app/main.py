from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Pastikan path import ini sesuai dengan struktur folder 'app' Anda
from app.core.database import engine, Base
import app.models  # noqa: F401 — Memaksa registrasi semua model SQLAlchemy ke Base

# Import router dari submodule routers
from app.routers.kecamatan_routers import router as kecamatan_router
from app.routers.fasilitas_routers import router as fasilitas_router
from app.routers.analisis_routers import router as analisis_router
from app.routers.dataset_router import router as dataset_router

# ──────────────────────────────────────────────────────────────────────────
# DDL AUTOMATION: Buat semua tabel + skema PostGIS jika belum ada di DB
# Sangat krusial untuk ekosistem Docker agar database langsung siap pakai
# ──────────────────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ──────────────────────────────────────────────────────────────────────────
# INISIALISASI APLIKASI FASTAPI
# ──────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="GeoDashboard API – Kota Bekasi",
    description="""
API Backend dengan dukungan spasial (PostGIS) dan analisis data (scikit-learn) 
untuk aplikasi visualisasi magnet aktivitas wilayah Kota Bekasi.

## Cakupan Endpoint per Use Case Riset:

| Use Case | Fitur Utama | Endpoint Utama |
|----------|-------------|----------------|
| **UC1** | Visualisasi Magnet Ekonomi (Choropleth) | `POST /analisis/run`, `GET /analisis/choropleth` |
| **UC2** | Filter & Overlay Titik Spasial | `GET /fasilitas/filter?jenis=...`, `GET /fasilitas/kategori` |
| **UC3** | Detail Statistik Wilayah (Pop-up) | `GET /kecamatan/{id}/statistik` |
| **UC4** | About Us / Metodologi Riset | *(Halaman statis di Frontend — Tidak butuh API)* |
    """,
    version="1.0.0",
    docs_url="/docs",      # Akses Swagger UI di http://localhost:8000/docs
    redoc_url="/redoc",    # Akses ReDoc di http://localhost:8000/redoc
)

# ──────────────────────────────────────────────────────────────────────────
# CORS MIDDLEWARE (Cross-Origin Resource Sharing)
# Mengizinkan Frontend lokal (React pada port 3000 atau Vite pada port 5173)
# untuk mengambil data dari backend tanpa terblokir oleh browser kebijakan CORS.
# ──────────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",    # Default Create React App
        "http://localhost:5173",    # Default Vite (React / Vue)
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],            # Mengizinkan semua method HTTP (GET, POST, PUT, DELETE)
    allow_headers=["*"],            # Mengizinkan semua HTTP Headers
)

# ──────────────────────────────────────────────────────────────────────────
# REGISTRASI ROUTERS / ENDPOINTS
# ──────────────────────────────────────────────────────────────────────────
app.include_router(kecamatan_router)
app.include_router(fasilitas_router)
app.include_router(analisis_router)
app.include_router(dataset_router)

# ──────────────────────────────────────────────────────────────────────────
# HEALTH CHECK / ROOT ENDPOINT
# ──────────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Root"], summary="Health Check API")
def root():
    """
    Endpoint penanda bahwa server backend FastAPI berjalan dengan normal.
    """
    return {
        "status": "healthy",
        "project": "Web GIS Klasterisasi Magnet Aktivitas Perkotaan Kota Bekasi",
        "version": "1.0.0",
        "documentation": "/docs"
    }