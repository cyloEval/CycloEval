from pydantic import BaseModel, ConfigDict
from typing import List

class RouteCreate(BaseModel):
    user_id: int
    coordinate_ids: List[int]

class RouteResponse(BaseModel):
    id: int
    user_id: int
    coordinate_ids: List[int]
    model_config = ConfigDict(from_attributes=True)

class RouteResponseWithCoordinates(BaseModel):
    id: int
    user_id: int
    latitude: List[float]
    longitude: List[float]
    altitude: List[float]
    model_config = ConfigDict(from_attributes=True)


