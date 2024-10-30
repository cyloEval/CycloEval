from typing import Optional
from pydantic import BaseModel



class SensorData(BaseModel):
    time: float
    x: Optional[float]
    y: Optional[float]
    z: Optional[float]
    qx: Optional[float]
    qy: Optional[float]
    qz: Optional[float]
    qw: Optional[float]
    latitude: Optional[float]
    longitude: Optional[float]
    altitude: Optional[float]
    speed: Optional[float]
