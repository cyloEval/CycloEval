from sqlalchemy.orm import Session
from server.models.models import DetectedShock, Coordinate
from server.schemas.detected_shock import DetectedShockCreate

def create_detected_shock(db: Session, shock: DetectedShockCreate):
    db_coordinate = Coordinate(latitude=shock.latitude, longitude=shock.longitude, altitude=shock.altitude)
    db.add(db_coordinate)
    db.commit()
    db.refresh(db_coordinate)

    db_shock = DetectedShock(timestamp=shock.timestamp, zAccel=shock.zAccel, userId=shock.userId, coordinateId=db_coordinate.id)
    db.add(db_shock)
    db.commit()
    db.refresh(db_shock)
    return db_shock

def get_shocks_by_user(db: Session, user_id: int):
    return db.query(DetectedShock).filter(DetectedShock.userId == user_id).all()
