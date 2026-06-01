import json
import pandas as pd
from sqlalchemy.sql import text
from app.core.database import SessionLocal
from app.models.kecamatan import Kecamatan
from app.models.fasilitas_ekonomi import FasilitasEkonomi

def seed_data():
    db = SessionLocal()
    print("=== Mulai Rekonstruksi Geometri Kecamatan ===")

    # Bersihkan tabel lama hingga akar (CASCADE akan menghapus fasilitas juga)
    db.execute(text("TRUNCATE kecamatan CASCADE"))
    db.commit()

    with open("app/data/Kecamatan_Bekasi.geojson", "r") as f:
        geojson_data = json.load(f)
    
    df_csv = pd.read_csv("app/data/Data Kecamatan Bekasi.csv")
    df_csv['Kecamatan_Clean'] = df_csv['Kecamatan'].astype(str).str.strip().str.lower()

    match_count = 0
    # SATU LOOP TUNGGAL UNTUK MEMASTIKAN GEOMETRI TIDAK BERTUMPUK
    for feature in geojson_data['features']:
        nama_geo = feature['properties'].get('NAMOBJ')
        geom_dict = feature['geometry'] # Diambil setiap iterasi
        
        if not nama_geo:
            continue
            
        nama_geo_clean = str(nama_geo).strip().lower()
        nama_geo_match = nama_geo_clean.replace(" ", "")
        
        csv_row = df_csv[df_csv['Kecamatan_Clean'].str.replace(" ", "") == nama_geo_match]
        
        if not csv_row.empty:
            row = csv_row.iloc[0]
            
            kecamatan = Kecamatan(
                nama_kecamatan=row['Kecamatan'],
                luas_km2=float(row['Luas (Km2)']),
                total_umkm=int(row['Total UMKM']),
                jumlah_mall=int(row['Mall']),
                jumlah_pasar=int(row['Pasar']),
                jumlah_stasiun=int(row['Stasiun KA'])
            )
            
            db.add(kecamatan)
            db.flush() 

            # Update geometri secara presisi berdasarkan kecamatan_id saat ini
            query = text("UPDATE kecamatan SET geom = ST_Force2D(ST_GeomFromGeoJSON(:geom)) WHERE kecamatan_id = :id")
            db.execute(query, {"geom": json.dumps(geom_dict), "id": kecamatan.kecamatan_id})
            print(f"  ✓ {kecamatan.nama_kecamatan} -> Koordinat geometri UNIK tersimpan!")
            match_count += 1
    
    db.commit()
    db.close()
    print(f"=== Selesai! {match_count} kecamatan direkonstruksi ===\n")

def seed_fasilitas():
    db = SessionLocal()
    print("=== Memulai Input Data Fasilitas Ekonomi ===")

    with open("app/data/titik_fasilitas_bersih.geojson", "r") as f:
        geojson_data = json.load(f)

    success_count = 0
    for feature in geojson_data['features']:
        props = feature['properties']
        geom_dict = feature['geometry']

        osm_id = str(props.get('osm_id', ''))
        nama_fasilitas = props.get('name', 'Tanpa Nama')
        amenity = props.get('amenity')
        shop = props.get('shop')
        railway = props.get('railway')
        jenis_fasilitas = props.get('jenis_fasilitas', 'Lainnya')

        query_spatial_join = text("""
            SELECT kecamatan_id FROM kecamatan 
            WHERE ST_Contains(kecamatan.geom, ST_Force2D(ST_GeomFromGeoJSON(:point_geom)))
            LIMIT 1;
        """)
        
        spatial_result = db.execute(query_spatial_join, {"point_geom": json.dumps(geom_dict)}).fetchone()
        kecamatan_id = spatial_result[0] if spatial_result else None

        fasilitas = FasilitasEkonomi(
            osm_id=osm_id, nama_fasilitas=nama_fasilitas, amenity=amenity,
            shop=shop, railway=railway, jenis_fasilitas=jenis_fasilitas,
            kecamatan_id=kecamatan_id
        )

        db.add(fasilitas)
        db.flush()

        query_update_geom = text("UPDATE fasilitas_ekonomi SET geom = ST_Force2D(ST_GeomFromGeoJSON(:geom)) WHERE id = :id")
        db.execute(query_update_geom, {"geom": json.dumps(geom_dict), "id": fasilitas.id})
        
        success_count += 1

    db.commit()
    db.close()
    print(f"=== Selesai! {success_count} fasilitas berhasil disimpan ===")

# PASTI DIJALANKAN KEDUANYA
if __name__ == "__main__":
    seed_data()
    seed_fasilitas()
