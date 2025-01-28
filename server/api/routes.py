import logging
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta, datetime
from jose import JWTError, jwt
import json
from pydantic import BaseModel
import traceback
import os
import base64

from server.compute import process_gps_points
from server.crud import create_file, create_gps_point, get_all_gps_points, get_all_files, delete_gps_points_by_file, delete_file_by_id
from server.models import FileCreate, GPSPointCreate, GPSPointResponse, FileCreate, FileResponseShort
from server.core.database import get_db

# Configurer le logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class SendedData(BaseModel):
    filename: str
    raw_json: str

class ChunkData(BaseModel):
    chunk: str
    chunk_number: int
    total_chunks: int
    filename: str

UPLOAD_DIR = os.path.join(os.getcwd(), "server/upload")

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)



from fastapi import UploadFile, File, Form

@router.post("/upload-chunk/")
async def upload_chunk(
    chunk: UploadFile = File(...),  # Recevoir le fichier binaire
    chunk_number: int = Form(...),  # Autres données comme formulaire
    total_chunks: int = Form(...),
    filename: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        # Ensure filename is provided
        if not filename:
            raise HTTPException(status_code=400, detail="Filename must be provided")

        # Créer le chemin complet
        file_path = os.path.join(UPLOAD_DIR, filename)

        # Lire le contenu du fichier chunk
        with open(file_path, "ab") as f:
            content = await chunk.read()
            f.write(content)

        # Vérifier si tous les chunks sont uploadés
        if chunk_number == total_chunks - 1:
            logger.info(f"Processing file {filename}")

            # Lire le fichier complet pour le traiter
            with open(file_path, "r") as f:
                raw_json = f.read()

            json_data = json.loads(raw_json)
            os.remove(file_path)  # Supprimer le fichier après traitement

            logger.info(f"Computing file {filename}")
            gps_points = process_gps_points(json_data)
            file_record = create_file(db, FileCreate(filename=filename))

            for i, point in enumerate(gps_points):
                create_gps_point(db, point, file_record.id)

            return gps_points

        return {"message": f"Chunk {chunk_number} uploaded successfully"}
    except Exception as e:
        logger.error(f"Error uploading chunk: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")



@router.get("/GPSPoints", response_model=List[GPSPointResponse])
async def get_gps_points(db: Session = Depends(get_db)):
    return get_all_gps_points(db)


@router.delete("/delete-file/{file_id}")
async def delete_file(file_id: int, db: Session = Depends(get_db)):
    try:
        delete_gps_points_by_file(db, file_id)
        delete_file_by_id(db, file_id)
        logger.info(f"File and associated GPS points deleted successfully")
        return {"message": "File and associated GPS points deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/file", response_model=List[FileResponseShort])
def get_files(db: Session = Depends(get_db)):
    return get_all_files(db)

@router.post("/reset-database")
async def reset_db(db: Session = Depends(get_db)):
    try:
        reset_database(db)
        return {"message": "Database reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))