from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class GPSPointCreate(BaseModel):
    latitude: float
    longitude: float
    altitude: Optional[float]
    horizontalAccuracy: Optional[float]
    verticalAccuracy: Optional[float]
    speedAccuracy: Optional[float]
    zAccel: float
    timestamp: datetime

class GPSPointResponse(BaseModel):
    id: int
    latitude: float
    longitude: float
    altitude: Optional[float]
    horizontalAccuracy: Optional[float]
    verticalAccuracy: Optional[float]
    speedAccuracy: Optional[float]
    zAccel: float
    timestamp: datetime

class FileCreate(BaseModel):
    filename: str

class FileResponseShort(BaseModel):
    id: int
    filename: str
    upload_time: datetime

class FileResponse(BaseModel):
    id: int
    filename: str
    upload_time: datetime
    gps_points: List[GPSPointResponse]