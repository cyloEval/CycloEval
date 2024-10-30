from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "user"
    userId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    createdAt = Column(DateTime, default=datetime.now, onupdate=datetime.now())

    detected_shocks = relationship("DetectedShock", back_populates="user")
    files = relationship("File", back_populates="user")
    routes = relationship("Route", back_populates="user")

class Coordinate(Base):
    __tablename__ = "coordinate"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    altitude = Column(Float, nullable=True)

    location = relationship("Location", back_populates="coordinate")

class Location(Base):
    __tablename__ = "location"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    routeId = Column(Integer, ForeignKey("route.id"), unique=True, nullable=False)
    coordinateId = Column(Integer, ForeignKey("coordinate.id"), unique=True, nullable=False)

    route = relationship("Route", back_populates="bounds")
    coordinate = relationship("Coordinate", back_populates="location")

class DetectedShock(Base):
    __tablename__ = "detected_shock"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, nullable=False)
    zAccel = Column(Float, nullable=False)
    userId = Column(Integer, ForeignKey("user.userId"), nullable=False)
    coordinateId = Column(Integer, ForeignKey("coordinate.id"), nullable=False)

    user = relationship("User", back_populates="detected_shocks")
    coordinate = relationship("Coordinate")

class Route(Base):
    __tablename__ = "route"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    createdAt = Column(DateTime, default=datetime.now, onupdate=datetime.now())
    userId = Column(Integer, ForeignKey("user.userId"), nullable=False)

    user = relationship("User", back_populates="routes")
    bounds = relationship("Location", back_populates="route")

class File(Base):
    __tablename__ = "file"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    uploadAt = Column(DateTime, default=datetime.now, onupdate=datetime.now())
    userId = Column(Integer, ForeignKey("user.userId"), nullable=False)
    content = Column(String, nullable=False)

    user = relationship("User", back_populates="files")
