from sqlalchemy.orm import Session
from server.models.models import Location
from server.schemas.location import LocationCreate

def create_location(db: Session, route_id: int, coordinate_id: int):
    db_location = Location(routeId=route_id, coordinateId=coordinate_id)
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location

def get_location(db: Session, location_id: int):
    return db.query(Location).filter(Location.id == location_id).first()
