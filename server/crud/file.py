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
        filename=db_file.name,
        upload_time=db_file.uploadAt
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

def get_all_files(db: Session) -> list[FileResponseShort]:
    files = db.query(File).all()
    return [
        FileResponseShort(
            id=file.id,
            filename=file.name,
            upload_time=file.uploadAt
        ) for file in files
    ]

def delete_file_by_id(db: Session, file_id: int) -> bool:
    db_file = db.query(File).filter(File.id == file_id).first()
    if db_file is None:
        return False
    db.delete(db_file)
    db.commit()
    return True

def reset_database(db: Session):
    db.query(GPSPoint).delete()
    db.query(File).delete()
    db.commit()