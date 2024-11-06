from sqlalchemy.orm import Session
from server.models import DetectedShock, Coordinate
from server.schemas import DetectedShockCreate, DetectedShockResponse, ShockData
from server.crud.coordinate import get_nearby_coordinate, create_coordinate
from datetime import datetime

# funtion for converting shockData to DetectedShockCreate object
def shockData_to_DetectedShockCreate(shock: ShockData, userId:int) -> DetectedShockCreate:
    return DetectedShockCreate(
        timestamp=datetime.fromtimestamp(shock.time),
        zAccel=shock.zAccel,
        userId=userId,
        latitude=shock.latitude,
        longitude=shock.longitude,
        altitude=shock.altitude
    )

def create_detected_shock(db: Session, shock: DetectedShockCreate) -> DetectedShockResponse:

    db_coordinate = get_nearby_coordinate(db, shock.latitude, shock.longitude)
    if not db_coordinate:
        db_coordinate = create_coordinate(db, shock.latitude, shock.longitude, shock.altitude)


    db_shock = DetectedShock(timestamp=shock.timestamp, zAccel=shock.zAccel, userId=shock.userId, coordinateId=db_coordinate.id)
    db.add(db_shock)
    db.commit()
    db.refresh(db_shock)
    return DetectedShockResponse(
        id=db_shock.id,
        timestamp=db_shock.timestamp,
        zAccel=db_shock.zAccel,
        userId=db_shock.userId,
        latitude=db_coordinate.latitude,
        longitude=db_coordinate.longitude,
        altitude=db_coordinate.altitude)

def get_all_shocks(db: Session) -> list[DetectedShockResponse]:
    shocks = db.query(DetectedShock).join(Coordinate, DetectedShock.coordinateId).all()
    return [
        DetectedShockResponse(
            id=shock.id,
            timestamp=shock.timestamp,
            zAccel=shock.zAccel,
            userId=shock.userId,
            latitude=shock.coordinate.latitude,
            longitude=shock.coordinate.longitude,
            altitude=shock.coordinate.altitude) for shock in shocks]

def get_shocks_by_user_with_coord(db: Session, user_id: int) -> list[DetectedShockResponse] | None:
    shocks = db.query(DetectedShock).join(Coordinate, DetectedShock.coordinateId).filter(DetectedShock.userId == user_id).all()
    return [
        DetectedShockResponse(
            id=shock.id,
            timestamp=shock.timestamp,
            zAccel=shock.zAccel,
            userId=shock.userId,
            latitude=shock.coordinate.latitude,
            longitude=shock.coordinate.longitude,
            altitude=shock.coordinate.altitude) for shock in shocks]

