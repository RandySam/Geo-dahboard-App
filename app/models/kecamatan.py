from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from app.core.database import Base

class Kecamatan(Base):
    __tablename__ = "kecamatan"

    kecamatan_id = Column(Integer, primary_key=True, index=True)
    nama_kecamatan = Column(String(100), unique=True, nullable=False)
    luas_km2 = Column(Float)
    total_umkm = Column(Integer, default=0)
    jumlah_stasiun = Column(Integer, default=0)
    jumlah_mall = Column(Integer, default=0)
    jumlah_pasar = Column(Integer, default=0)
    jumlah_lrt = Column(Integer, default=0)
    jumlah_halte = Column(Integer, default=0)
    jumlah_terminal = Column(Integer, default=0)
    geom = Column(Geometry(geometry_type="MULTIPOLYGON", srid=4326))

    fasilitas = relationship("FasilitasEkonomi", back_populates="kecamatan")
    detail_analisis = relationship("DetailAnalisis", back_populates="kecamatan")

