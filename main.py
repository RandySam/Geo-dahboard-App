from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import json

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "backend kita ges"}

# 🔥 biar React bisa akses
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔌 koneksi database
conn = psycopg2.connect(
    dbname="gis_bekasi",
    user="postgres",
    password="123456",
    host="localhost",
    port="5432"
)

@app.get("/batas")
def get_batas():
    cursor = conn.cursor()

    cursor.execute("""
        SELECT ST_AsGeoJSON(geom), nama
        FROM batas_kecamatan
    """)

    rows = cursor.fetchall()

    features = []

    for row in rows:
        geom = json.loads(row[0])

        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": {
                "nama": row[1]
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }

@app.get("/fasilitas")
def get_fasilitas():
    cursor = conn.cursor()

    cursor.execute("""
        SELECT ST_AsGeoJSON(geom), nama, jenis
        FROM public.titik_fasilitas_bersih
    """)

    rows = cursor.fetchall()

    features = []

    for row in rows:
        geom = json.loads(row[0])

        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": {
                "nama": row[1],
                "jenis": row[2]
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }

@app.get("/import-fasilitas")
def import_fasilitas():
    cursor = conn.cursor()

    with open("titik_fasilitas_bersih.geojson") as f:
        data = json.load(f)

    for feature in data["features"]:
        geom = json.dumps(feature["geometry"])

        props = feature.get("properties", {})
        nama = props.get("name")
        jenis = props.get("jenis_fasilitas")

        cursor.execute("""
            INSERT INTO titik_fasilitas_bersih (geom, nama, jenis)
            VALUES (ST_GeomFromGeoJSON(%s), %s, %s)
        """, (geom, nama, jenis))

    conn.commit()

    return {"message": "import selesai 🔥"}

@app.get("/import-batas")
def import_batas():
    cursor = conn.cursor()

    with open("Batas_Kota_Bekasi.geojson") as f:
        data = json.load(f)

    for feature in data["features"]:
        try:
            geom = json.dumps(feature["geometry"])

            props = feature.get("properties", {})
            nama = props.get("NAMOBJ")

            cursor.execute("""
                INSERT INTO batas_kecamatan (geom, nama)
                VALUES (
                    ST_Force2D(
                        ST_SetSRID(
                            ST_GeomFromGeoJSON(%s),
                            4326
                        )
                    ),
                    %s
                )
            """, (geom, nama))

        except Exception as e:
            print("ERROR:", e)
            conn.rollback()

    conn.commit()

    return {"message": "batas masuk 🔥"}

@app.get("/analisis")
def get_analisis():
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            b.nama,
            COUNT(f.*) AS jumlah_fasilitas
        FROM batas_kecamatan b
        LEFT JOIN titik_fasilitas_bersih f
        ON ST_Within(f.geom, b.geom)
        GROUP BY b.nama
        ORDER BY jumlah_fasilitas DESC
    """)

    rows = cursor.fetchall()

    # Ambil semua jumlah fasilitas buat ranking
    jumlah_list = [row[1] for row in rows]
    total = len(jumlah_list)

    hasil = []

    for i, row in enumerate(rows):
        jumlah = row[1]

        # Ranking berdasarkan urutan DESC dari SQL
        persentase_rank = (i + 1) / total

        # Top 30% = Padat
        if persentase_rank <= 0.3:
            kategori = "Padat"

        # Tengah 40% = Sedang
        elif persentase_rank <= 0.7:
            kategori = "Sedang"

        # Bottom 30% = Rendah
        else:
            kategori = "Rendah"

        hasil.append({
            "kecamatan": row[0],
            "jumlah_fasilitas": jumlah,
            "kategori": kategori
        })

    cursor.close()

    return hasil