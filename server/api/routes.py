import logging
from fastapi import APIRouter, Depends, HTTPException
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

@router.post("/importSensorData", response_model=List[GPSPointCreate])
async def import_sensor_data(data: SendedData, db: Session = Depends(get_db)):
    filename, raw_json = data.filename, data.raw_json
    json_data = json.loads(raw_json)
    try:

        # Process the raw data
        gps_points = process_gps_points(json_data)

        # Store the GPS Points
        file = create_file(db, FileCreate(filename=filename))
        for point in gps_points:
            create_gps_point(db, point, file.id)

        return gps_points

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file")
    except Exception as e:
        stack_trace = traceback.format_exc()
        print(stack_trace)
        raise HTTPException(status_code=500, detail=f'Internal Server Error: {str(e)}')

@router.get("/GPSPoints", response_model=List[GPSPointResponse])
async def get_gps_points(db: Session = Depends(get_db)):
    return get_all_gps_points(db)
