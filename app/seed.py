import json
import pandas as pd
from sqlalchemy.sql import text
from app.core.database import SessionLocal
from app.models.kecamatan import Kecamatan
from app.models.fasilitas_ekonomi import FasilitasEkonomi

def seed_data():
    db = SessionLocal()
    print("Mulai proses input data")

    # Import data
    with open("app/data/Kecamatan_Bekasi.geojson", "r") as f:
        geojson_data = json.load(f)
    
    df_csv = pd.read_csv("app/data/Data Kecamatan Bekasi.csv")
    df_csv['Kecamatan_Clean'] = df_csv['Kecamatan'].astype(str).str.strip().str.lower()

    for feature in geojson_data['features']:
        nama_geo = feature['properties']['NAMOBJ']
        geom_dict = feature['geometry']

    match_count = 0
    for feature in geojson_data['features']:
        # Mengambil properti NAMOBJ dari GeoJSON Anda
        nama_geo = feature['properties'].get('NAMOBJ')
        if not nama_geo:
            continue
            
        # Bersihkan string nama dari GeoJSON
        nama_geo_clean = str(nama_geo).strip().lower()
        
        # Atasi perbedaan penulisan kasus khusus seperti 'pondokgede' vs 'pondok gede'
        # Kita hapus semua spasi hanya untuk perbandingan kecocokan logika
        nama_geo_match = nama_geo_clean.replace(" ", "")
        
        # Cari baris yang cocok di CSV (dengan menghapus spasi juga saat membandingkan)
        csv_row = df_csv[df_csv['Kecamatan_Clean'].str.replace(" ", "") == nama_geo_match]
        
        if not csv_row.empty:
            row = csv_row.iloc[0]
            
            # Buat objek model Kecamatan
            kecamatan = Kecamatan(
                nama_kecamatan=row['Kecamatan'],
                luas_km2=float(row['Luas (Km2)']),
                total_umkm=int(row['Total UMKM']),
                jumlah_mall=int(row['Mall']),
                jumlah_pasar=int(row['Pasar']),
                jumlah_stasiun=int(row['Stasiun KA'])
            )
            
            db.add(kecamatan)
            db.flush()  # Agar kita mendapatkan kecamatan_id yang baru dibuat

            # Masukkan Geometri menggunakan PostGIS native function via text SQL
            query = text(
                "UPDATE kecamatan SET geom = ST_Force2D(ST_GeomFromGeoJSON(:geom)) WHERE kecamatan_id = :id"
            )
            db.execute(query, {"geom": json.dumps(geom_dict), "id": kecamatan.kecamatan_id})
            print(f"  ✓ Berhasil memasukkan wilayah: {kecamatan.nama_kecamatan}")
            match_count += 1
        else:
            print(f"  ⚠ Peringatan: Wilayah '{nama_geo}' di GeoJSON tidak memiliki kecocokan data di CSV.")
    
    db.commit()
    db.close()
    print(f"=== Selesai! {match_count} data kecamatan berhasil disimpan ke database ===")


def seed_fasilitas():
    db = SessionLocal()
    print("\n=== Memulai Proses Input Data Fasilitas Ekonomi ===")

    # 1. Buka file GeoJSON fasilitas bersih Anda
    try:
        with open("app/data/titik_fasilitas_bersih.geojson", "r") as f:
            geojson_data = json.load(f)
        print(f"✓ Berhasil membaca GeoJSON Fasilitas. Jumlah fitur: {len(geojson_data['features'])}")
    except FileNotFoundError:
        print("✗ Gagal: File tidak ditemukan di 'app/data/titik_fasilitas_bersih.geojson'")
        return

    success_count = 0
    skip_count = 0

    for feature in geojson_data['features']:
        props = feature['properties']
        geom_dict = feature['geometry']

        # Ambil metadata dari properti GeoJSON Anda
        osm_id = str(props.get('osm_id', ''))
        nama_fasilitas = props.get('name', 'Tanpa Nama')
        amenity = props.get('amenity')
        shop = props.get('shop')
        railway = props.get('railway')
        jenis_fasilitas = props.get('jenis_fasilitas', 'Lainnya')

        # 2. SPATIAL INTERSECTION (Mencari otomatis kecamatan berdasarkan titik koordinat)
        # Kita tanya ke PostGIS: "Titik ini berada di dalam poligon kecamatan mana?"
        query_spatial_join = text("""
            SELECT kecamatan_id, nama_kecamatan 
            FROM kecamatan 
            WHERE ST_Contains(kecamatan.geom, ST_Force2D(ST_GeomFromGeoJSON(:point_geom)))
            LIMIT 1;
        """)
        
        spatial_result = db.execute(query_spatial_join, {"point_geom": json.dumps(geom_dict)}).fetchone()

        if spatial_result:
            kecamatan_id = spatial_result[0]
            nama_kecamatan = spatial_result[1]
        else:
            # Jika titik berada sedikit di luar batas poligon (efek toleransi peta)
            kecamatan_id = None
            nama_kecamatan = "Luar Batas Bekasi / Tidak Diketahui"
            skip_count += 1

        # 3. Buat Objek Model FasilitasEkonomi
        fasilitas = FasilitasEkonomi(
            osm_id=osm_id,
            nama_fasilitas=nama_fasilitas,
            amenity=amenity,
            shop=shop,
            railway=railway,
            jenis_fasilitas=jenis_fasilitas,
            kecamatan_id=kecamatan_id
        )

        db.add(fasilitas)
        db.flush() # Dapatkan fasilitas_id

        # 4. Masukkan Geometri Point ke Database dengan ST_Force2D
        query_update_geom = text("""
            UPDATE fasilitas_ekonomi 
            SET geom = ST_Force2D(ST_GeomFromGeoJSON(:point_geom)) 
            WHERE id = :id
        """)
        db.execute(query_update_geom, {"point_geom": json.dumps(geom_dict), "id": fasilitas.id})
        
        success_count += 1
        if success_count % 50 == 0:
            print(f"  → Berhasil memproses {success_count} titik fasilitas...")

    db.commit()
    db.close()
    print(f"=== Selesai! {success_count} fasilitas berhasil disimpan. ({skip_count} titik di luar batas kecamatan) ===")

if __name__ == "__main__":
    # seed_data()
    seed_fasilitas()