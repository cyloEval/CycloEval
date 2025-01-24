from sqlalchemy.orm import Session
from server.models import File, GPSPoint
from server.models import FileCreate, FileResponseShort, FileResponse, GPSPointResponse

def create_file(db: Session, file_create: FileCreate) -> FileResponseShort:
    db_file = File(name=file_create.filename)
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return FileResponseShort(
        id=db_file.id,
        filename=db_file.name
    )

def get_file(db: Session, file_id: int) -> FileResponse:
    db_file = db.query(File).filter(File.id == file_id).first()
    gps_points = [
        GPSPointResponse(
            id=point.id,
            latitude=point.latitude,
            longitude=point.longitude,
            altitude=point.altitude,
            horizontalAccuracy=point.horizontalAccuracy,
            verticalAccuracy=point.verticalAccuracy,
            speedAccuracy=point.speedAccuracy,
            zAccel=point.zAccel,
            timestamp=point.timestamp
        ) for point in db_file.gps_points
    ]
    return FileResponse(
        id=db_file.id,
        filename=db_file.name,
        upload_time=db_file.uploadAt,
        gps_points=gps_points
    )