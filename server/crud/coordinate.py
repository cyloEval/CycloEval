from sqlalchemy.orm import Session
from server.models.models import Coordinate
from server.schemas.coordinate import CoordinateCreate

def create_coordinate(db: Session, latitude: float, longitude: float, altitude: float = None):
    db_coordinate = Coordinate(latitude=latitude, longitude=longitude, altitude=altitude)
    db.add(db_coordinate)
    db.commit()
    db.refresh(db_coordinate)
    return db_coordinate

def get_coordinate(db: Session, coordinate_id: int):
    return db.query(Coordinate).filter(Coordinate.id == coordinate_id).first()
