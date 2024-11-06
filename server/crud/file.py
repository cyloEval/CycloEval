from sqlalchemy.orm import Session
from server.models import File
from server.schemas import FileCreate, FileResponse, FileResponseShort

def create_file(db: Session, FileCreate: FileCreate) -> FileResponseShort:
    db_file = File(name=FileCreate.filename, user_id=FileCreate.user_id, content=FileCreate.content)
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return FileResponseShort(
        id=db_file.id,
        filename=db_file.name,
        user_id=db_file.user_id,
    )

def get_file(db: Session, file_id: int) -> FileResponse:
    db_file = db.query(File).filter(File.id == file_id).first()
    return FileResponse(
        id=db_file.id,
        filename=db_file.name,
        user_id=db_file.user_id,
        upload_time=db_file.uploadAt,
        content=db_file.content
    )

def get_files_by_user(db: Session, user_id: int) -> list[FileResponse]:
    files = db.query(File).filter(File.user_id == user_id).all()
    return [FileResponse(
        id=file.id,
        filename=file.name,
        user_id=file.user_id,
        upload_time=file.uploadAt,
        content=file.content
    ) for file in files]

