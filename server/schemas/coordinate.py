from pydantic import BaseModel
from pydantic import ConfigDict

class CoordinateCreate(BaseModel):
    latitude: float
    longitude: float
    altitude: float = None

class CoordinateResponse(BaseModel):
    id: int
    latitude: float
    longitude: float
    altitude: float = None

    model_config = ConfigDict(from_attributes=True)
