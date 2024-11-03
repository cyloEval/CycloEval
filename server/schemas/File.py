from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List

class DetectedShockCreate(BaseModel):
    timestamp: datetime
    latitude: float
    longitude: float
    altitude: float
    acceleration: float
    user_id: int
    file_id: int

class DetectedShockResponse(BaseModel):
    id: int
    timestamp: datetime
    latitude: float
    longitude: float
    altitude: float
    acceleration: float
    user_id: int
    file_id: int

    model_config = ConfigDict(from_attributes=True)

class FileCreate(BaseModel):
    filename: str
    user_id: int
    raw_data: str

class FileResponse(BaseModel):
    id: int
    filename: str
    user_id: int
    upload_time: datetime
    raw_data: str

    model_config = ConfigDict(from_attributes=True)
