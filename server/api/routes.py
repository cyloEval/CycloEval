import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta, datetime
from jose import JWTError, jwt
import json
from pydantic import BaseModel
import traceback

from server.compute import process_gps_points
from server.crud import create_file, create_gps_point, get_all_gps_points
from server.models import FileCreate, GPSPointCreate, GPSPointResponse, FileCreate, FileResponse
from server.core.database import get_db

# Configurer le logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class SendedData(BaseModel):
    filename: str
    raw_json: str

import gzip
import io

@router.post("/importSensorData", response_model=List[GPSPointCreate])
async def import_sensor_data(request: Request, db: Session = Depends(get_db)):
    try:
        # Décoder le gzip
        raw_data = await request.body()
        decompressed_data = gzip.decompress(raw_data).decode('utf-8')

        # Charger les données JSON
        data = json.loads(decompressed_data)
        filename = data.get("filename")
        raw_json = data.get("raw_json")

        # Processus normal
        gps_points = process_gps_points(json.loads(raw_json))
        file = create_file(db, FileCreate(filename=filename))
        for point in gps_points:
            create_gps_point(db, point, file.id)

        return gps_points

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f'Internal Server Error: {str(e)}')

@router.get("/GPSPoints", response_model=List[GPSPointResponse])
async def get_gps_points(db: Session = Depends(get_db)):
    return get_all_gps_points(db)
