from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from app.core.database import Base

class FasilitasEkonomi(Base):
    __tablename__ = "fasilitas_ekonomi"

    id = Column(Integer, primary_key=True, index=True)
    osm_id = Column(String(50))
    nama_fasilitas = Column(String(255))
    amenity = Column(String(100))
    shop = Column(String(100))
    railway = Column(String(100))
    jenis_fasilitas = Column(String(100)) # Kategori kustom (Kuliner, Mall, dll)
    
    # Foreign Key ke Kecamatan
    kecamatan_id = Column(Integer, ForeignKey("kecamatan.kecamatan_id", ondelete="SET NULL"))
    
    # Kolom Spasial (Data Titik dari GeoJSON)
    geom = Column(Geometry(geometry_type='POINT', srid=4326))

    # Relasi
    kecamatan = relationship("Kecamatan", back_populates="fasilitas")