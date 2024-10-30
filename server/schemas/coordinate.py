from pydantic import BaseModel

class CoordinateCreate(BaseModel):
    latitude: float
    longitude: float
    altitude: float = None
