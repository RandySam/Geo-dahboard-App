from pathlib import Path

from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter(
prefix="/dataset",
tags=["Dataset"],
)

DATA_DIR = (
Path(__file__)
.resolve()
.parent.parent
/ "data"
)

@router.get(
"/list",
summary="Daftar dataset penelitian",
description="""
Kembalikan daftar dataset yang digunakan
dalam penelitian dan tersedia untuk diunduh.
""",
)
def get_dataset_list():

    return {
    "datasets": [
        {
            "id": "kecamatan_csv",
            "name": "Data Kecamatan Bekasi",
            "filename": "Data Kecamatan Bekasi.csv",
            "type": "CSV",
            "description": (
                "Dataset numerik kecamatan "
                "yang digunakan sebagai "
                "input analisis K-Means."
            ),
            "download_url": "/dataset/kecamatan-csv",
        },
        {
            "id": "kecamatan_geojson",
            "name": "Kecamatan Bekasi",
            "filename": "Kecamatan_Bekasi.geojson",
            "type": "GeoJSON Polygon",
            "description": (
                "Dataset batas administrasi "
                "12 kecamatan Kota Bekasi."
            ),
            "download_url": "/dataset/kecamatan-geojson",
        },
        {
            "id": "fasilitas_geojson",
            "name": "Titik Fasilitas Bersih",
            "filename": "titik_fasilitas_bersih.geojson",
            "type": "GeoJSON Point",
            "description": (
                "Dataset titik fasilitas "
                "ekonomi hasil preprocessing."
            ),
            "download_url": "/dataset/fasilitas-geojson",
        },
    ]
}

@router.get(
"/kecamatan-csv",
summary="Unduh dataset kecamatan (CSV)",
)
def download_kecamatan_csv():

    file_path = (
    DATA_DIR
    / "Data Kecamatan Bekasi.csv"
    )

    return FileResponse(
    path=file_path,
    filename="Data Kecamatan Bekasi.csv",
    media_type="text/csv",
    )

@router.get(
"/kecamatan-geojson",
summary="Unduh dataset kecamatan (GeoJSON)",
)
def download_kecamatan_geojson():

    file_path = (
    DATA_DIR
    / "Kecamatan_Bekasi.geojson"
    )

    return FileResponse(
    path=file_path,
    filename="Kecamatan_Bekasi.geojson",
    media_type="application/geo+json",
    )

@router.get(
"/fasilitas-geojson",
summary="Unduh dataset fasilitas ekonomi (GeoJSON)",
)
def download_fasilitas_geojson():

    file_path = (
    DATA_DIR
    / "titik_fasilitas_bersih.geojson"
    )

    return FileResponse(
    path=file_path,
    filename="titik_fasilitas_bersih.geojson",
    media_type="application/geo+json",
    )