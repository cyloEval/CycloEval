from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DetectedShockCreate(BaseModel):
    timestamp: datetime
    zAccel: float
    userId: int
    latitude: float
    longitude: float
    altitude: Optional[float] = None

class DetectedShockResponse(BaseModel):
    id: int
    timestamp: datetime
    zAccel: float
    userId: int
    coordinateId: int

    class Config:
        orm_mode = True
