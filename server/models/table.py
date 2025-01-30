from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class File(Base):
    __tablename__ = "file"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    uploadAt = Column(DateTime, default=datetime.now)
    gps_points = relationship("GPSPoint", back_populates="file")

class GPSPoint(Base):
    __tablename__ = "gps_point"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    altitude = Column(Float, nullable=True)
    horizontalAccuracy = Column(Float, nullable=True)
    verticalAccuracy = Column(Float, nullable=True)
    speedAccuracy = Column(Float, nullable=True)
    file_id = Column(Integer, ForeignKey("file.id"), nullable=False)
    zAccel = Column(Float, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    file = relationship("File", back_populates="gps_points")