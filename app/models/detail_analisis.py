from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class DetailAnalisis(Base):
    __tablename__ = "detail_analisis"

    detail_id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    analisis_id = Column(Integer, ForeignKey("hasil_analisis.hasil_id", ondelete="CASCADE"))
    kecamatan_id = Column(Integer, ForeignKey("kecamatan.kecamatan_id", ondelete="CASCADE"))
    
    # Hasil Clustering
    cluster_label = Column(Integer) # Misal: 0, 1, atau 2

    # Relasi
    hasil = relationship("HasilAnalisis", back_populates="details")
    kecamatan = relationship("Kecamatan", back_populates="detail_analisis")