from sqlalchemy.orm import Session
from server.models import Coordinate
from geopy.distance import geodesic
from server.schemas import CoordinateCreate, CoordinateResponse


def get_coordinate(db: Session, coordinate_id: int) -> CoordinateResponse:
    coordinate = db.query(Coordinate).filter(Coordinate.id == coordinate_id).first()
    return CoordinateResponse(
        id=coordinate.id,
        latitude=coordinate.latitude,
        longitude=coordinate.longitude,
        altitude=coordinate.altitude
    ) if coordinate else None

def get_nearby_coordinate(db: Session, latitude: float, longitude: float, radius: float = 1.0):
    coordinates = db.query(Coordinate).all()
    for coord in coordinates:
        distance = geodesic((latitude, longitude), (coord.latitude, coord.longitude)).meters
        if distance <= radius:
            return CoordinateResponse(
                id=coord.id,
                latitude=coord.latitude,
                longitude=coord.longitude,
                altitude=coord.altitude
            )
    return None


def create_coordinate(db: Session, latitude: float, longitude: float, altitude: float = None) -> CoordinateResponse:
    nearby_coordinate = get_nearby_coordinate(db, latitude, longitude)

    if nearby_coordinate:
        return nearby_coordinate

    db_coordinate = Coordinate(latitude=latitude, longitude=longitude, altitude=altitude)
    db.add(db_coordinate)
    db.commit()
    db.refresh(db_coordinate)
    return CoordinateResponse(
        id=db_coordinate.id,
        latitude=db_coordinate.latitude,
        longitude=db_coordinate.longitude,
        altitude=db_coordinate.altitude
    ) if db_coordinate else None

