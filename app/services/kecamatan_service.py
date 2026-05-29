from sqlalchemy.orm import Session

from app.repositories.kecamatan_repository import KecamatanRepository
from app.repositories.fasilitas_repository import FasilitasRepository
from app.repositories.analisis_repository import AnalisisRepository
from app.schemas.kecamatan import (
    KecamatanResponse,
    KecamatanFeature,
    KecamatanGeoJSONCollection,
    KecamatanStatistikResponse,
)


class KecamatanService:
    def __init__(self, db: Session):
        self.kecamatan_repo = KecamatanRepository(db)
        self.fasilitas_repo = FasilitasRepository(db)
        self.analisis_repo  = AnalisisRepository(db)

    # ──────────────────────────────────────────────
    # UC1 & UC2 — Layer batas wilayah untuk Leaflet
    # Kembalikan GeoJSON FeatureCollection semua kecamatan
    # ──────────────────────────────────────────────
    def get_all_geojson(self) -> KecamatanGeoJSONCollection:
        rows = self.kecamatan_repo.get_all_as_geojson()

        features = []
        for r in rows:
            properties = KecamatanResponse(
                kecamatan_id=r.kecamatan_id,
                nama_kecamatan=r.nama_kecamatan,
                luas_km2=r.luas_km2,
                total_umkm=r.total_umkm,
                jumlah_stasiun=r.jumlah_stasiun,
                jumlah_mall=r.jumlah_mall,
                jumlah_pasar=r.jumlah_pasar,
            )
            features.append(KecamatanFeature(
                geometry=r.geometry,
                properties=properties,
            ))

        return KecamatanGeoJSONCollection(features=features)

    # ──────────────────────────────────────────────
    # UC3 — Detail statistik untuk pop-up klik wilayah
    # Gabungkan data statis kecamatan + hasil klaster
    # + jumlah fasilitas ekonomi dari tabel fasilitas
    # ──────────────────────────────────────────────
    def get_statistik(self, kecamatan_id: int) -> KecamatanStatistikResponse | None:
        # 1. Ambil data kecamatan
        kecamatan = self.kecamatan_repo.get_by_id(kecamatan_id)
        if not kecamatan:
            return None

        # 2. Ambil hasil klaster terakhir untuk kecamatan ini
        detail = self.analisis_repo.get_latest_detail_by_kecamatan(kecamatan_id)

        # 3. Hitung jumlah fasilitas ekonomi dari tabel fasilitas_ekonomi
        jumlah_fasilitas = self.kecamatan_repo.count_fasilitas(kecamatan_id)

        return KecamatanStatistikResponse(
            kecamatan_id=kecamatan.kecamatan_id,
            nama_kecamatan=kecamatan.nama_kecamatan,
            luas_km2=kecamatan.luas_km2,
            total_umkm=kecamatan.total_umkm,
            jumlah_stasiun=kecamatan.jumlah_stasiun,
            jumlah_mall=kecamatan.jumlah_mall,
            jumlah_pasar=kecamatan.jumlah_pasar,
            cluster_label=detail.cluster_label if detail else None,
            jumlah_fasilitas_ekonomi=jumlah_fasilitas,
        )

    # ──────────────────────────────────────────────
    # List semua kecamatan tanpa geometry
    # Dipakai untuk dropdown / referensi
    # ──────────────────────────────────────────────
    def get_all(self) -> list[KecamatanResponse]:
        kecamatans = self.kecamatan_repo.get_all()
        return [
            KecamatanResponse(
                kecamatan_id=k.kecamatan_id,
                nama_kecamatan=k.nama_kecamatan,
                luas_km2=k.luas_km2,
                total_umkm=k.total_umkm,
                jumlah_stasiun=k.jumlah_stasiun,
                jumlah_mall=k.jumlah_mall,
                jumlah_pasar=k.jumlah_pasar,
            )
            for k in kecamatans
        ]
