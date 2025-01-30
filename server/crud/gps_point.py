from sqlalchemy.orm import Session
from server.models.table import GPSPoint
from server.models import GPSPointCreate, GPSPointResponse




def create_gps_point(db:Session, gps_point: GPSPointCreate, file_id: int) -> GPSPointResponse:
    db_gps_point = GPSPoint(
        timestamp=gps_point.timestamp,
        zAccel=gps_point.zAccel,
        latitude=gps_point.latitude,
        longitude=gps_point.longitude,
        altitude=gps_point.altitude,
        horizontalAccuracy=gps_point.horizontalAccuracy,
        verticalAccuracy=gps_point.verticalAccuracy,
        speedAccuracy=gps_point.speedAccuracy,
        file_id=file_id
    )
    db.add(db_gps_point)
    db.commit()
    db.refresh(db_gps_point)
    return GPSPointResponse(
        id=db_gps_point.id,
        timestamp=db_gps_point.timestamp,
        zAccel=db_gps_point.zAccel,
        latitude=db_gps_point.latitude,
        longitude=db_gps_point.longitude,
        altitude=db_gps_point.altitude,
        horizontalAccuracy=db_gps_point.horizontalAccuracy,
        verticalAccuracy=db_gps_point.verticalAccuracy,
        speedAccuracy=db_gps_point.speedAccuracy
    )

def get_all_gps_points(db: Session) -> list[GPSPointResponse]:
    gps_points = db.query(GPSPoint).all()
    return [
        GPSPointResponse(
            id=point.id,
            timestamp=point.timestamp,
            zAccel=point.zAccel,
            latitude=point.latitude,
            longitude=point.longitude,
            altitude=point.altitude,
            horizontalAccuracy=point.horizontalAccuracy,
            verticalAccuracy=point.verticalAccuracy,
            speedAccuracy=point.speedAccuracy
        ) for point in gps_points
    ]

def get_gps_points_by_file(db: Session, file_id: int) -> list[GPSPointResponse] | None:
    gps_points = db.query(GPSPoint).filter(GPSPoint.file_id == file_id).all()
    return [
        GPSPointResponse(
            id=point.id,
            timestamp=point.timestamp,
            zAccel=point.zAccel,
            latitude=point.latitude,
            longitude=point.longitude,
            altitude=point.altitude,
            horizontalAccuracy=point.horizontalAccuracy,
            verticalAccuracy=point.verticalAccuracy,
            speedAccuracy=point.speedAccuracy
        ) for point in gps_points
    ]

def delete_gps_points_by_file(db: Session, file_id: int) -> None:
    db.query(GPSPoint).filter(GPSPoint.file_id == file_id).delete()
    db.commit()
    return None