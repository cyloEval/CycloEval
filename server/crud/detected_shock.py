from sqlalchemy.orm import Session
from server.models import DetectedShock, Coordinate
from server.schemas import DetectedShockCreate, DetectedShockResponse, ShockData, CoordinateCreate
from server.crud.coordinate import get_nearby_coordinate, create_coordinate
from datetime import datetime

# funtion for converting shockData to DetectedShockCreate object
def shockData_to_DetectedShockCreate(shock: ShockData, userId:int) -> DetectedShockCreate:

    timestamp = datetime.fromtimestamp(shock.time // 10e8)

    return DetectedShockCreate(
        timestamp=timestamp,
        zAccel=shock.zAccel,
        userId=userId,
        latitude=shock.latitude,
        longitude=shock.longitude,
        altitude=shock.altitude
    )

def create_detected_shock(db: Session, shock: DetectedShockCreate) -> DetectedShockResponse:

    coord = CoordinateCreate(latitude=shock.latitude, longitude=shock.longitude, altitude=shock.altitude)

    db_coordinate = get_nearby_coordinate(db, coord.latitude, coord.longitude)
    if not db_coordinate:
        db_coordinate = create_coordinate(db, coord)

    db_shock = DetectedShock(timestamp=shock.timestamp, zAccel=shock.zAccel, user_id=shock.userId, coordinate_id=db_coordinate.id)
    db.add(db_shock)
    db.commit()
    db.refresh(db_shock)
    return DetectedShockResponse(
        id=db_shock.id,
        timestamp=db_shock.timestamp,
        zAccel=db_shock.zAccel,
        userId=db_shock.user_id,
        latitude=db_coordinate.latitude,
        longitude=db_coordinate.longitude,
        altitude=db_coordinate.altitude)

def get_all_shocks(db: Session) -> list[DetectedShockResponse]:
    shocks = db.query(DetectedShock).join(Coordinate , DetectedShock.coordinate_id==Coordinate.id).all()
    return [
        DetectedShockResponse(
            id=shock.id,
            timestamp=shock.timestamp,
            zAccel=shock.zAccel,
            userId=shock.user_id,
            latitude=shock.coordinate.latitude,
            longitude=shock.coordinate.longitude,
            altitude=shock.coordinate.altitude) for shock in shocks]

def get_shocks_by_user_with_coord(db: Session, user_id: int) -> list[DetectedShockResponse] | None:
    shocks = db.query(DetectedShock).join(Coordinate, DetectedShock.coordinate_id == Coordinate.id).filter(DetectedShock.user_id == user_id).all()
    return [
        DetectedShockResponse(
            id=shock.id,
            timestamp=shock.timestamp,
            zAccel=shock.zAccel,
            userId=shock.user_id,
            latitude=shock.coordinate.latitude,
            longitude=shock.coordinate.longitude,
            altitude=shock.coordinate.altitude) for shock in shocks]

