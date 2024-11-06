from sqlalchemy import Table, Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

# Table d'association pour la relation many-to-many
route_coordinate = Table(
    'route_coordinate', Base.metadata,
    Column('route_id', Integer, ForeignKey('route.id'), primary_key=True),
    Column('coordinate_id', Integer, ForeignKey('coordinate.id'), primary_key=True)
)

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    createdAt = Column(DateTime, default=datetime.now)  # Correction : sans parenthèses

    detected_shocks = relationship("DetectedShock", back_populates="user")
    files = relationship("File", back_populates="user")
    routes = relationship("Route", back_populates="user")

class Coordinate(Base):
    __tablename__ = "coordinate"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    altitude = Column(Float, nullable=True)

    routes = relationship("Route", secondary=route_coordinate, back_populates="coordinates")
    detected_shocks = relationship("DetectedShock", back_populates="coordinate")

class DetectedShock(Base):
    __tablename__ = "detected_shock"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, nullable=False)
    zAccel = Column(Float, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    coordinate_id = Column(Integer, ForeignKey("coordinate.id"), nullable=False)

    user = relationship("User", back_populates="detected_shocks")
    coordinate = relationship("Coordinate", back_populates="detected_shocks")

class Route(Base):
    __tablename__ = "route"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    createdAt = Column(DateTime, default=datetime.now)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)

    user = relationship("User", back_populates="routes")
    coordinates = relationship("Coordinate", secondary=route_coordinate, back_populates="routes")

class File(Base):
    __tablename__ = "file"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    uploadAt = Column(DateTime, default=datetime.now)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    content = Column(String, nullable=False)

    user = relationship("User", back_populates="files")
