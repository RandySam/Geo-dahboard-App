from sqlalchemy import Column, Integer, Text, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class HasilAnalisis(Base):
    __tablename__ = "hasil_analisis"

    hasil_id = Column(Integer, primary_key=True, index=True)
    tanggal_analisis = Column(DateTime(timezone=True), server_default=func.now())
    jumlah_k = Column(Integer, nullable=False)
    silhouette_score = Column(Float)
    keterangan = Column(Text)

    # Relasi
    details = relationship("DetailAnalisis", back_populates="hasil")